"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Medal, CheckCircle2, FileCode2, Copy } from "lucide-react";

interface MedalData {
  medalId: string;
  item_type: string;
  limit_level: string;
  max_class: string;
  char_growth_1: string;
  char_growth_2: string;
  char_growth_3: string;
  char_growth_4: string;
  item_growth_1: string;
  item_growth_2: string;
  item_growth_3: string;
  item_growth_4: string;
  name: string;
  icon: string;
  manual: string;
  sell_peso: string;
}

export default function MedalGeneratorPage() {
  const [medal, setMedal] = useState<MedalData>({
    medalId: "9999",
    item_type: "1",
    limit_level: "0",
    max_class: "0",
    char_growth_1: "-1",
    char_growth_2: "2",
    char_growth_3: "-1",
    char_growth_4: "0",
    item_growth_1: "0",
    item_growth_2: "0",
    item_growth_3: "1",
    item_growth_4: "0",
    name: "STR(1)",
    icon: "Grade1#grade_05",
    manual: "1",
    sell_peso: "1",
  });

  const [generatedOutput, setGeneratedOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const updateMedal = (key: keyof MedalData, val: string) => {
    setMedal(prev => ({ ...prev, [key]: val }));
  };

  const handleGenerate = () => {
    const output = `[item_info_${medal.medalId}]
item_type\t=\t${medal.item_type}
limit_level\t=\t${medal.limit_level}

max_class\t=\t${medal.max_class}

char_growth_1\t=\t${medal.char_growth_1}
char_growth_2\t=\t${medal.char_growth_2}
char_growth_3\t=\t${medal.char_growth_3}
char_growth_4\t=\t${medal.char_growth_4}
item_growth_1\t=\t${medal.item_growth_1}
item_growth_2\t=\t${medal.item_growth_2}
item_growth_3\t=\t${medal.item_growth_3}
item_growth_4\t=\t${medal.item_growth_4}

name\t=\t${medal.name}
icon\t=\t${medal.icon}
manual\t=\t${medal.manual}
sell_peso\t=\t${medal.sell_peso}
`;
    setGeneratedOutput(output);
    setCopied(false);
  };

  return (
    <div className="flex flex-col flex-1 p-8 h-full bg-background overflow-hidden">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-amber-500 rounded-full"></div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Medal Generator</h1>
            <p className="text-muted-foreground text-sm font-medium">
              Single-block generator untuk <span className="font-mono text-amber-500/80">sp2_medalitem_info.ini</span>.
            </p>
          </div>
        </div>
        <Button 
          onClick={handleGenerate} 
          className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm font-bold gap-2"
        >
          <FileCode2 className="w-4 h-4" />
          Generate INI
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* LEFT PANEL - Editor Form */}
        <div className="xl:col-span-2 flex flex-col h-full min-h-0">
          <Card className="flex-1 flex flex-col min-h-0 border-border/50 bg-card/50 backdrop-blur-sm shadow-sm relative overflow-hidden">
            
            <CardHeader className="p-6 border-b border-border/50 shrink-0 bg-background/50">
              <CardTitle className="text-xl font-bold tracking-tight text-amber-500 flex items-center gap-3">
                <Medal className="w-5 h-5" />
                Medal Configuration
              </CardTitle>
              <CardDescription className="text-xs font-semibold mt-1">
                Atur status (growth) untuk Karakter dan Item.
              </CardDescription>
            </CardHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Basic Info */}
              <div>
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-bold text-amber-500/80 uppercase">Medal ID (item_info_X)</label>
                    <Input 
                      value={medal.medalId} 
                      onChange={(e) => updateMedal("medalId", e.target.value)} 
                      className="font-mono text-xs border-amber-500/30 focus-visible:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Item Type</label>
                    <Input 
                      value={medal.item_type} 
                      onChange={(e) => updateMedal("item_type", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Limit Level</label>
                    <Input 
                      value={medal.limit_level} 
                      onChange={(e) => updateMedal("limit_level", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Max Class</label>
                    <Input 
                      value={medal.max_class} 
                      onChange={(e) => updateMedal("max_class", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                </div>
              </div>

              {/* Character Growth */}
              <div>
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Character Growth
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Growth 1</label>
                    <Input 
                      value={medal.char_growth_1} 
                      onChange={(e) => updateMedal("char_growth_1", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Growth 2</label>
                    <Input 
                      value={medal.char_growth_2} 
                      onChange={(e) => updateMedal("char_growth_2", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Growth 3</label>
                    <Input 
                      value={medal.char_growth_3} 
                      onChange={(e) => updateMedal("char_growth_3", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Growth 4</label>
                    <Input 
                      value={medal.char_growth_4} 
                      onChange={(e) => updateMedal("char_growth_4", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                </div>
              </div>

              {/* Item Growth */}
              <div>
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Item Growth
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Growth 1</label>
                    <Input 
                      value={medal.item_growth_1} 
                      onChange={(e) => updateMedal("item_growth_1", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Growth 2</label>
                    <Input 
                      value={medal.item_growth_2} 
                      onChange={(e) => updateMedal("item_growth_2", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Growth 3</label>
                    <Input 
                      value={medal.item_growth_3} 
                      onChange={(e) => updateMedal("item_growth_3", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Growth 4</label>
                    <Input 
                      value={medal.item_growth_4} 
                      onChange={(e) => updateMedal("item_growth_4", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                </div>
              </div>

              {/* Display & Economy */}
              <div>
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Display & Economy
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Name</label>
                    <Input 
                      value={medal.name} 
                      onChange={(e) => updateMedal("name", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Icon</label>
                    <Input 
                      value={medal.icon} 
                      onChange={(e) => updateMedal("icon", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Manual</label>
                    <Input 
                      value={medal.manual} 
                      onChange={(e) => updateMedal("manual", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Sell Peso</label>
                    <Input 
                      value={medal.sell_peso} 
                      onChange={(e) => updateMedal("sell_peso", e.target.value)} 
                      className="font-mono text-xs bg-background/50"
                    />
                  </div>
                </div>
              </div>
              
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL - Output Column */}
        <div className="flex flex-col gap-6 h-full min-h-0">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-4 border-b border-border/50 flex flex-row items-center justify-between shrink-0">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                Output INI
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 font-bold shadow-sm h-8 hover:text-amber-500 hover:border-amber-500"
                onClick={() => {
                  if(!generatedOutput) return;
                  navigator.clipboard.writeText(generatedOutput);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </CardHeader>
            
            <div className="flex-1 p-0 relative group overflow-hidden">
              {!generatedOutput && (
                <div className="absolute inset-0 flex items-center justify-center flex-col text-muted-foreground/50 z-10">
                  <FileCode2 className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm font-medium">Click Generate INI first</p>
                </div>
              )}
              <textarea 
                className="w-full h-full bg-transparent border-0 resize-none font-mono text-[11px] leading-relaxed p-6 text-foreground/80 focus:outline-none shadow-none"
                readOnly
                placeholder="; Generated output will appear here..."
                value={generatedOutput}
                spellCheck={false}
              />
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
