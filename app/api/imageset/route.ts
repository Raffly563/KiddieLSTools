import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";
import iconv from "iconv-lite";

const RS_INDO_PATH = "C:/Users/Administrator/Desktop/RS INDO/xml";

export async function GET() {
  try {
    const xmlFiles = [
      "uiimageset.xml",
      "uiimageset_.xml",
      "uiimageset_Old.xml",
      "uiimageseteditor.xml"
    ];

    const imageSets: any = {};
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

    for (const fileName of xmlFiles) {
      const filePath = path.join(RS_INDO_PATH, fileName);
      if (!fs.existsSync(filePath)) continue;

      const buffer = fs.readFileSync(filePath);
      const content = iconv.decode(buffer, "euc-kr");
      
      const result = parser.parse(content);
      const imagesetLayout = result.ImagesetLayout || result.Imageset;
      
      let sets = [];
      if (Array.isArray(imagesetLayout?.Imageset)) {
        sets = imagesetLayout.Imageset;
      } else if (imagesetLayout?.Imageset) {
        sets = [imagesetLayout.Imageset];
      } else if (result.Imageset) {
        sets = [result.Imageset];
      }

      for (const set of sets) {
        const setName = set["@_Name"];
        const setFile = set["@_File"] || set["@_Imagefile"];
        
        let images = [];
        if (Array.isArray(set.Image)) {
          images = set.Image;
        } else if (set.Image) {
          images = [set.Image];
        }

        const items: any = {};
        for (const img of images) {
          items[img["@_Name"]] = {
            x: parseInt(img["@_X"] || img["@_XPos"] || "0", 10),
            y: parseInt(img["@_Y"] || img["@_YPos"] || "0", 10),
            width: parseInt(img["@_Width"] || "0", 10),
            height: parseInt(img["@_Height"] || "0", 10)
          };
        }

        imageSets[setName] = {
          file: setFile,
          images: items
        };
      }
    }

    return NextResponse.json({ imageSets });
  } catch (error: any) {
    console.error("Failed to parse imagesets:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
