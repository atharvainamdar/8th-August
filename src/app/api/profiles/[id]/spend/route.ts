import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const cost = Number(body.cost || 0);
  if (!Number.isFinite(cost) || cost <= 0) {
    return NextResponse.json({ error: "Invalid cost" }, { status: 400 });
  }
  const child = await prisma.childProfile.findUnique({ where: { id } });
  if (!child) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (child.stars < cost) {
    return NextResponse.json({ error: "Not enough stars" }, { status: 400 });
  }
  const updated = await prisma.childProfile.update({
    where: { id },
    data: { stars: child.stars - cost },
  });
  await prisma.learnerEvent.create({
    data: {
      childId: id,
      type: "reward_redeem",
      payload: JSON.stringify({ rewardId: body.rewardId, cost }),
    },
  });
  return NextResponse.json({ stars: updated.stars });
}
