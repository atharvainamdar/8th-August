import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAllSkills } from "@/lib/curriculum/skills";
import { getAllLessons } from "@/lib/curriculum/syllabus";
import { capabilitySummary } from "@/lib/ai/capabilities";

export async function GET() {
  let dbOk = false;
  let profiles = 0;
  try {
    profiles = await prisma.childProfile.count();
    dbOk = true;
  } catch {
    dbOk = false;
  }
  const caps = capabilitySummary();
  return NextResponse.json({
    ok: dbOk,
    service: "lumi",
    time: new Date().toISOString(),
    skills: getAllSkills().length,
    lessons: getAllLessons().length,
    profiles,
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    aiConfigured: caps.cloudLlm !== "local",
    ...caps,
  });
}
