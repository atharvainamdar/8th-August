import { NextResponse } from "next/server";
import { analyzeHomeworkImage } from "@/lib/ai/provider";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const guidance = await analyzeHomeworkImage(buf.toString("base64"), file.type || "image/jpeg");
  return NextResponse.json({ guidance });
}
