import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const setlists = await prisma.setlist.findMany({
    orderBy: { createdAt: "desc" },
    include: { songs: true },
  });
  return NextResponse.json(setlists);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  const setlist = await prisma.setlist.create({
    data: {
      title: body.title.trim(),
      date: body.date ? new Date(body.date) : null,
    },
  });

  return NextResponse.json(setlist, { status: 201 });
}
