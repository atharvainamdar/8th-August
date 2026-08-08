import { PrismaClient } from "@prisma/client";
import { ensureMasteryMap } from "../src/lib/curriculum/skills";

const prisma = new PrismaClient();

async function seedChild(data: {
  displayName: string;
  ageBand: string;
  sensoryMode: string;
  interestPack: string;
  masteryBoosts?: Record<string, number>;
}) {
  const child = await prisma.childProfile.create({
    data: {
      displayName: data.displayName,
      ageBand: data.ageBand,
      sensoryMode: data.sensoryMode,
      interestPack: data.interestPack,
      placed: true,
      celebrationLevel: data.sensoryMode === "calm" ? "low" : "medium",
      motionEnabled: data.sensoryMode !== "calm",
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

  return child;
}

async function main() {
  await prisma.learnerEvent.deleteMany();
  await prisma.session.deleteMany();
  await prisma.skillMastery.deleteMany();
  await prisma.childProfile.deleteMany();

  await seedChild({
    displayName: "Ava",
    ageBand: "7-8",
    sensoryMode: "calm",
    interestPack: "trains",
    masteryBoosts: {
      "read.phoneme.isolate": 0.75,
      "read.letters.sounds": 0.6,
      "math.number.10": 0.8,
      "math.number.20": 0.55,
    },
  });

  await seedChild({
    displayName: "Leo",
    ageBand: "9-10",
    sensoryMode: "balanced",
    interestPack: "dinos",
    masteryBoosts: {
      "read.phonics.cvc": 0.85,
      "read.phonics.blends": 0.7,
      "read.fluency.short": 0.6,
      "math.ops.add_100": 0.75,
      "math.ops.mul_concept": 0.4,
      "write.sentence.frame": 0.65,
    },
  });

  await seedChild({
    displayName: "Sam",
    ageBand: "7-8",
    sensoryMode: "bright",
    interestPack: "space",
    masteryBoosts: {
      "math.number.20": 0.8,
      "math.placevalue.tens": 0.7,
      "write.letters.lowercase": 0.55,
      "write.spelling.cvc": 0.35,
      "read.phonics.cvc": 0.5,
    },
  });

  console.log("Seeded Ava, Leo, Sam demo profiles");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
