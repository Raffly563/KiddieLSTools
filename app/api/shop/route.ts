import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const INI_PATH = path.join(process.cwd(), 'public', 'ini', 'sp2_etcitem_info.ini');
const TEXT_PATH = path.join(process.cwd(), 'public', 'text', 'text.txt');

// Helper to load and parse text.txt for etcitem strings
function loadTextMap() {
  const map = new Map<string, string>();
  if (!fs.existsSync(TEXT_PATH)) return map;
  
  const content = fs.readFileSync(TEXT_PATH, 'utf-8');
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    if (line.startsWith('|INI_sp2_etcitem_info::')) {
      const parts = line.split('|');
      if (parts.length >= 3) {
        map.set(parts[1], parts[2]);
      }
    }
  }
  return map;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (!fs.existsSync(INI_PATH)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    const content = fs.readFileSync(INI_PATH, 'utf-8');
    const textMap = loadTextMap();

    // 1. ACTION: LIST ITEMS (For the sidebar)
    if (action === 'list') {
      const items = [];
      const lines = content.split(/\r?\n/);
      let currentItem = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check if it's a new section block e.g. [etcitem1]
        const sectionMatch = line.match(/^\[(.*)\]/i);
        if (sectionMatch) {
          const sectionName = sectionMatch[1];
          if (sectionName.toLowerCase().startsWith('etcitem')) {
            currentItem = sectionName;
            items.push({ id: currentItem, name: currentItem, type: '', resolvedName: '' });
          } else {
            currentItem = null; // some other block like [common]
          }
          continue;
        }

        if (currentItem) {
          const nameMatch = line.match(/^name\s*=\s*(.*)/i);
          const typeMatch = line.match(/^type\s*=\s*(.*)/i);
          
          if (nameMatch) {
            let rawName = nameMatch[1].trim();
            items[items.length - 1].name = rawName;
            
            // Resolve STR(X) to actual text
            if (rawName.toUpperCase().startsWith('STR(')) {
              const num = rawName.toUpperCase().replace('STR(', '').replace(')', '');
              const resolved = textMap.get(`INI_sp2_etcitem_info::${currentItem}_${num}`);
              if (resolved) {
                items[items.length - 1].resolvedName = resolved;
              }
            }
          } else if (typeMatch) {
            items[items.length - 1].type = typeMatch[1].trim();
          }
        }
      }

      return NextResponse.json({ items });
    }

    // 2. ACTION: GET ITEM DETAILS (For the editor form)
    if (action === 'get') {
      const id = searchParams.get('id');
      if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

      // Match the specific block
      const regex = new RegExp(`(^|\\n)\\s*\\[${id}\\]\\s*\\n([\\s\\S]*?)(?=(?:\\n\\s*\\[|$))`, 'i');
      const match = content.match(regex);
      
      if (!match) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

      const block = match[2];
      const parsed: Record<string, string> = {};
      const resolvedTexts: Record<string, string> = {};
      
      block.split(/\r?\n/).forEach(line => {
        const lineTrimmed = line.trim();
        if (lineTrimmed.startsWith(';') || !lineTrimmed) return; // Ignore comments and empty lines
        
        const kvMatch = lineTrimmed.match(/^([a-zA-Z0-9_]+)\s*=\s*(.*)$/);
        if (kvMatch) {
          const key = kvMatch[1].trim();
          const val = kvMatch[2].trim();
          parsed[key] = val;
          
          // Resolve if value is STR(x)
          if (val.toUpperCase().startsWith('STR(')) {
             const num = val.toUpperCase().replace('STR(', '').replace(')', '');
             const resolved = textMap.get(`INI_sp2_etcitem_info::${id}_${num}`);
             if (resolved) {
               resolvedTexts[key] = resolved;
             }
          }
        }
      });

      return NextResponse.json({ id, data: parsed, resolvedTexts });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'download') {
      const updatesMap = await request.json(); // e.g. { etcitem1: { sell_peso: "2000" } }
      if (!fs.existsSync(INI_PATH)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      
      let content = fs.readFileSync(INI_PATH, 'utf-8');

      // Apply all updates in memory
      for (const [id, updates] of Object.entries(updatesMap)) {
        const blockRegex = new RegExp(`(^|\\n)(\\s*\\[${id}\\]\\s*\\n)([\\s\\S]*?)(?=\\n\\s*\\[|$)`, 'i');
        const blockMatch = content.match(blockRegex);
        
        if (blockMatch) {
          const prefix = blockMatch[1] + blockMatch[2];
          let blockContent = blockMatch[3];

          for (const [key, value] of Object.entries(updates as any)) {
            const keyRegex = new RegExp(`^(\\s*${key}\\s*=\\s*)(.*)$`, 'im');
            if (blockContent.match(keyRegex)) {
              blockContent = blockContent.replace(keyRegex, `$1${value}`);
            } else {
              blockContent += `${key}\t=\t${value}\n`;
            }
          }
          content = content.replace(blockRegex, `${prefix}${blockContent}`);
        }
      }

      // Return the file content as a downloadable response
      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': 'attachment; filename="sp2_etcitem_info.ini"',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
