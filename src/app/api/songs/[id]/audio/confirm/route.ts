import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

function isOwnBlobUrl(url: string) {
  const storeId = process.env.BLOB_STORE_ID?.replace(/^store_/, "").toLowerCase();
  if (!storeId) return false;
  try {
    return new URL(url).hostname === `${storeId}.public.blob.vercel-storage.com`;
  } catch {
    return false;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: songId } = await params;
  const { url, pathname, replaceId } = await request.json();

  if (typeof url !== "string" || typeof pathname !== "string" || !isOwnBlobUrl(url)) {
    return NextResponse.json({ error: "Invalid blob url" }, { status: 400 });
  }

  const existing = await prisma.audioFile.findFirst({ where: { songId, url } });
  if (existing) return NextResponse.json(existing);

  if (typeof replaceId === "string") {
    const old = await prisma.audioFile.findUnique({ where: { id: replaceId } });
    if (old && old.songId === songId) {
      await del(old.url);
      await prisma.audioFile.delete({ where: { id: replaceId } });
    }
  }

  const name = decodeURIComponent(pathname.split("/").pop() ?? pathname);
  const created = await prisma.audioFile.create({
    data: { songId, name, url },
  });

  return NextResponse.json(created);
}
