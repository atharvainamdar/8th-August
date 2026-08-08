import syllabus from "../../../content/syllabus.json";

export type SyllabusLesson = {
  id: string;
  title: string;
  skills: string[];
  modalities: string[];
  minutes: number;
};

export type SyllabusUnit = {
  id: string;
  domain: string;
  title: string;
  skills: string[];
  lessons: SyllabusLesson[];
};

export function getSyllabus() {
  return syllabus;
}

export function getAllLessons(): SyllabusLesson[] {
  return (syllabus.units as SyllabusUnit[]).flatMap((u) => u.lessons);
}

export function getLesson(id: string): SyllabusLesson | undefined {
  return getAllLessons().find((l) => l.id === id);
}

export function getUnitForLesson(lessonId: string): SyllabusUnit | undefined {
  return (syllabus.units as SyllabusUnit[]).find((u) =>
    u.lessons.some((l) => l.id === lessonId)
  );
}

export function getWeekPlan() {
  return syllabus.weeks;
}
