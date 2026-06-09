import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: songId } = await params;
  const files = await prisma.audioFile.findMany({
    where: { songId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(files);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: songId } = await params;
  const body = (await request.json()) as HandleUploadBody;

  const json = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/x-m4a", "audio/mp4"],
      maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB
    }),
    onUploadCompleted: async ({ blob }) => {
      const name = decodeURIComponent(blob.pathname.split("/").pop() ?? blob.pathname);
      await prisma.audioFile.create({
        data: { songId, name, url: blob.url },
      });
    },
  });

  return NextResponse.json(json);
}
