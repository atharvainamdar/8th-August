import { PrismaClient } from "@prisma/client";
import { ensureMasteryMap } from "../src/lib/curriculum/skills";
import { getAllLessons } from "../src/lib/curriculum/syllabus";

const prisma = new PrismaClient();

async function seedChild(
  parentId: string,
  data: {
    displayName: string;
    ageBand: string;
    sensoryMode: string;
    interestPack: string;
    masteryBoosts?: Record<string, number>;
    streakDays?: number;
    stars?: number;
  }
) {
  const child = await prisma.childProfile.create({
    data: {
      parentId,
      displayName: data.displayName,
      ageBand: data.ageBand,
      sensoryMode: data.sensoryMode,
      interestPack: data.interestPack,
      placed: true,
      celebrationLevel: data.sensoryMode === "calm" ? "low" : "medium",
      motionEnabled: data.sensoryMode !== "calm",
      streakDays: data.streakDays ?? 0,
      bestStreak: data.streakDays ?? 0,
      stars: data.stars ?? 0,
      totalMinutes: (data.streakDays ?? 0) * 12,
      lastPracticeDate: data.streakDays ? new Date().toISOString().slice(0, 10) : null,
    },
  });

  const mastery = ensureMasteryMap(undefined);
  for (const [skillId, mean] of Object.entries(data.masteryBoosts ?? {})) {
    const strength = 8;
    mastery[skillId] = {
      skillId,
      alpha: mean * strength,
      beta: (1 - mean) * strength,
    };
  }

  await prisma.skillMastery.createMany({
    data: Object.values(mastery).map((m) => ({
      childId: child.id,
      skillId: m.skillId,
      alpha: m.alpha,
      beta: m.beta,
    })),
  });

  const lessons = getAllLessons();
  await prisma.lessonProgress.createMany({
    data: lessons.map((lesson, idx) => ({
      childId: child.id,
      lessonId: lesson.id,
      unitId: lesson.id.startsWith("lesson.read")
        ? "unit.read.1"
        : lesson.id.startsWith("lesson.write")
          ? "unit.write.1"
          : lesson.id.startsWith("lesson.math")
            ? "unit.math.1"
            : "unit.mixed.1",
      status: idx < 3 ? "done" : idx < 6 ? "available" : "locked",
      score: idx < 3 ? 0.8 : 0,
      completedAt: idx < 3 ? new Date() : null,
    })),
  });

  return child;
}

async function main() {
  await prisma.learnerEvent.deleteMany();
  await prisma.session.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.skillMastery.deleteMany();
  await prisma.childProfile.deleteMany();
  await prisma.parentAccount.deleteMany();

  const parent = await prisma.parentAccount.create({
    data: {
      email: "parent@demo.lumi",
      name: "Demo Parent",
      plan: "trial",
    },
  });

  await seedChild(parent.id, {
    displayName: "Ava",
    ageBand: "7-8",
    sensoryMode: "calm",
    interestPack: "trains",
    streakDays: 3,
    stars: 24,
    masteryBoosts: {
      "read.phoneme.isolate": 0.75,
      "read.letters.sounds": 0.6,
      "math.number.10": 0.8,
      "math.number.20": 0.55,
    },
  });

  await seedChild(parent.id, {
    displayName: "Leo",
    ageBand: "9-10",
    sensoryMode: "balanced",
    interestPack: "dinos",
    streakDays: 5,
    stars: 40,
    masteryBoosts: {
      "read.phonics.cvc": 0.85,
      "read.phonics.blends": 0.7,
      "read.fluency.short": 0.6,
      "math.ops.add_100": 0.75,
      "math.ops.mul_concept": 0.4,
      "write.sentence.frame": 0.65,
    },
  });

  await seedChild(parent.id, {
    displayName: "Sam",
    ageBand: "7-8",
    sensoryMode: "bright",
    interestPack: "space",
    streakDays: 1,
    stars: 12,
    masteryBoosts: {
      "math.number.20": 0.8,
      "math.placevalue.tens": 0.7,
      "write.letters.lowercase": 0.55,
      "write.spelling.cvc": 0.35,
      "read.phonics.cvc": 0.5,
    },
  });

  console.log("Seeded Demo Parent + Ava, Leo, Sam with syllabus progress");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
