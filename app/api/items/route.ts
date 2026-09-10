import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parseIni } from "@/lib/parser/ini-parser";

const RS_INDO_PATH = "C:/Users/Administrator/Desktop/RS INDO/xml";

export async function GET() {
  try {
    const filePath = path.join(RS_INDO_PATH, "sp2_setitem_info.ini");
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "sp2_setitem_info.ini not found in RS INDO/xml" }, { status: 404 });
    }

    const buffer = fs.readFileSync(filePath);
    const iniData = parseIni(buffer, "euc-kr");

    // Transform raw INI into an array of items
    const items = [];
    
    for (const [sectionKey, sectionData] of Object.entries(iniData)) {
      // Game items are usually named like [set_item1], [set_item2], etc.
      if (sectionKey.startsWith("set_item")) {
        const id = sectionKey.replace("set_item", "");
        items.push({
          id,
          name: sectionData.name || `Unknown (${id})`,
          code: sectionData.set_code || "",
          type: sectionData.char_attack_type || "",
          image: sectionData.img_name || "",
          level: sectionData.need_level1 || "0",
          shopOrder: sectionData.shop_order || "0",
          // Add more fields as needed for the table
        });
      }
    }

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("Failed to parse items:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
