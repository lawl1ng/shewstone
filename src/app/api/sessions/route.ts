import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sessions = await prisma.practiceSession.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(sessions);
  } catch (err) {
    console.error("GET /api/sessions error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const session = await prisma.practiceSession.create({
      data: {
        date: new Date(body.date),
        attendees: body.attendees || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (err) {
    console.error("POST /api/sessions error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
