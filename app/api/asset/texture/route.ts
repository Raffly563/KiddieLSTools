import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MAP_INDO_TEXTURE_PATH = "C:/Users/Administrator/Desktop/MAP INDO/resource/texture";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const file = searchParams.get("file");

    if (!file) {
      return NextResponse.json({ error: "File parameter is required" }, { status: 400 });
    }

    // Attempt to locate file in MAP INDO textures
    const filePath = path.join(MAP_INDO_TEXTURE_PATH, file);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Texture not found" }, { status: 404 });
    }

    const buffer = fs.readFileSync(filePath);

    // Return the raw buffer as application/octet-stream
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
