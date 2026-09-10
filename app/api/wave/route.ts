import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const WAVE_DIR = path.join(process.cwd(), "public", "wave", "wave");

function getWaveFiles(dirPath: string): any[] {
  let results: any[] = [];
  if (!fs.existsSync(dirPath)) return results;
  
  const list = fs.readdirSync(dirPath);
  for (const file of list) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      const children = getWaveFiles(fullPath);
      if (children.length > 0) {
        results.push({
          type: "directory",
          name: file,
          children: children
        });
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === ".wav" || ext === ".ogg" || ext === ".mp3") {
        let relPath = fullPath.substring(WAVE_DIR.length);
        relPath = relPath.replace(/\\/g, "/");
        if (!relPath.startsWith("/")) {
          relPath = "/" + relPath;
        }
        results.push({
          type: "file",
          name: file,
          path: `/wave/wave${relPath}`
        });
      }
    }
  }
  return results;
}

export async function GET() {
  try {
    const files = getWaveFiles(WAVE_DIR);
    return NextResponse.json({ files });
  } catch (error: any) {
    console.error("Failed to read wave dir:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
