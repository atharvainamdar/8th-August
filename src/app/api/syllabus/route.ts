import { NextResponse } from "next/server";
import { getAllLessons, getSyllabus, getUnitForLesson } from "@/lib/curriculum/syllabus";

export async function GET() {
  const syllabus = getSyllabus();
  const lessons = getAllLessons().map((lesson) => {
    const unit = getUnitForLesson(lesson.id);
    return {
      ...lesson,
      unitTitle: unit?.title,
      domain: unit?.domain,
    };
  });
  return NextResponse.json({ syllabus, lessons, weeks: syllabus.weeks });
}
