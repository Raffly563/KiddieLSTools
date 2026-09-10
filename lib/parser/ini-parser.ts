import iconv from "iconv-lite";

export interface IniSection {
  [key: string]: string;
}

export interface IniData {
  [section: string]: IniSection;
}

export function parseIni(buffer: Buffer, encoding: string = "euc-kr"): IniData {
  const content = iconv.decode(buffer, encoding);
  const lines = content.split(/\r?\n/);
  
  const result: IniData = {};
  let currentSection = "";

  for (let line of lines) {
    line = line.trim();
    // Ignore comments
    if (line.startsWith(";") || line.startsWith("#") || line === "") {
      continue;
    }

    // Check for section
    if (line.startsWith("[") && line.includes("]")) {
      currentSection = line.substring(1, line.indexOf("]")).trim();
      result[currentSection] = {};
      continue;
    }

    // Parse key = value
    const equalIdx = line.indexOf("=");
    if (equalIdx !== -1 && currentSection) {
      const key = line.substring(0, equalIdx).trim();
      // Remove inline comments after value if any (some game INIs do this)
      let value = line.substring(equalIdx + 1).trim();
      
      const commentIdx = value.indexOf(";");
      const commentIdx2 = value.indexOf("//");
      
      let endIdx = value.length;
      if (commentIdx !== -1) endIdx = Math.min(endIdx, commentIdx);
      if (commentIdx2 !== -1) endIdx = Math.min(endIdx, commentIdx2);
      
      value = value.substring(0, endIdx).trim();
      
      result[currentSection][key] = value;
    }
  }

  return result;
}
