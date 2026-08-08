import { NextResponse } from "next/server";
import { listProfiles } from "@/lib/db/profile";
import { prisma } from "@/lib/db/prisma";
import type { InterestPack, SensoryMode } from "@/lib/adaptive/types";
import { getAllLessons } from "@/lib/curriculum/syllabus";

export async function GET() {
  const profiles = await listProfiles();
  return NextResponse.json({ profiles });
}

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.parentEmail || "parent@demo.lumi").toLowerCase();
  const parentName = String(body.parentName || "Parent");
  const plan = String(body.plan || "trial");

  const parent = await prisma.parentAccount.upsert({
    where: { email },
    create: { email, name: parentName, plan },
    update: { name: parentName, plan },
  });

  const profile = await prisma.childProfile.create({
    data: {
      parentId: parent.id,
      displayName: String(body.displayName || "Friend"),
      ageBand: String(body.ageBand || "7-8"),
      sensoryMode: (body.sensoryMode || "balanced") as SensoryMode,
      interestPack: (body.interestPack || "space") as InterestPack,
      dyslexiaFont: Boolean(body.dyslexiaFont),
      soundEnabled: body.soundEnabled !== false,
      motionEnabled: body.motionEnabled !== false,
      celebrationLevel: body.celebrationLevel || "medium",
      sessionMinutes: Number(body.sessionMinutes || 15),
    },
  });

  const lessons = getAllLessons();
  await prisma.lessonProgress.createMany({
    data: lessons.map((lesson, idx) => ({
      childId: profile.id,
      lessonId: lesson.id,
      unitId: "unit.mixed.1",
      status: idx === 0 ? "available" : "locked",
    })),
  });

  return NextResponse.json({ profile, parent });
}
