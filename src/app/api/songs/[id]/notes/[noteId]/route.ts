import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; noteId: string }> }
) {
  const { noteId } = await params;
  await prisma.practiceNote.delete({ where: { id: noteId } });
  return new NextResponse(null, { status: 204 });
}
