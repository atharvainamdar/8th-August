const base = process.env.BASE_URL || "http://localhost:3000";

async function check(path, expect = 200) {
  const res = await fetch(base + path);
  if (res.status !== expect) {
    throw new Error(`${path} => ${res.status}`);
  }
  return res;
}

const pages = ["/", "/app", "/syllabus", "/parents", "/faq", "/legal/privacy", "/legal/terms", "/checkout", "/demo", "/setup", "/docs/pilot"];
for (const p of pages) {
  await check(p);
  console.log("ok", p);
}

const profiles = await (await check("/api/profiles")).json();
if (!profiles.profiles?.length) throw new Error("no profiles");
const id = profiles.profiles[0].id;
await check(`/api/today?childId=${id}`);
await check(`/api/syllabus`);
await check(`/api/report/weekly/${id}`);
await check(`/lessons/lesson.read.1`);
await check(`/rewards?childId=${id}`);
await check(`/settings/${id}`);
await check(`/history/${id}`);
console.log("smoke passed", base);
