import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");

    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!endpoint || !projectId || !bucketId) {
      return NextResponse.json(
        { ok: false, error: "Appwrite configuration is missing." },
        { status: 500 },
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "APPWRITE_API_KEY is missing." },
        { status: 500 },
      );
    }

    if (!fileId) {
      return NextResponse.json(
        { ok: false, error: "fileId is required." },
        { status: 400 },
      );
    }

    const url = `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;

    const appwriteResponse = await fetch(url, {
      headers: {
        "X-Appwrite-Project": projectId,
        "X-Appwrite-Key": apiKey,
      },
    });

    if (!appwriteResponse.ok || !appwriteResponse.body) {
      return NextResponse.json(
        { ok: false, error: "Failed to fetch video from Appwrite." },
        { status: appwriteResponse.status || 500 },
      );
    }

    const contentType = appwriteResponse.headers.get("content-type") ?? "video/mp4";

    return new Response(appwriteResponse.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (error) {
    console.error("[GET /api/appwrite/video]", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected error streaming video." },
      { status: 500 },
    );
  }
}
