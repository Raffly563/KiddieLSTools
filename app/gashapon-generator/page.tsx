"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Gift, Plus, Trash2, ChevronRight, FileCode2, Copy } from "lucide-react";

interface PresentItem {
  id: string;
  Rand: string;
  Whole_Alarm: string;
  Type: string;
  Value1: string;
  Value2: string;
  Peso: string;
}

interface GashaponSection {
  id: string;
  EtcItemType: string;
  PresentSendID: string;
  PresentAlarm: string;
  PresentMent: string;
  PresentPeriod: string;
  items: PresentItem[];
}

const DEFAULT_ITEM: Omit<PresentItem, "id"> = {
  Rand: "1000",
  Whole_Alarm: "0",
  Type: "1",
  Value1: "1",
  Value2: "7200",
  Peso: "0"
};

const DEFAULT_SECTION: Omit<GashaponSection, "id" | "items"> = {
  EtcItemType: "1000022",
  PresentSendID: "DeveloperK",
  PresentAlarm: "0",
  PresentMent: "12",
  PresentPeriod: "7"
};

export default function GashaponGeneratorPage() {
  const [sections, setSections] = useState<GashaponSection[]>([
    {
      id: "sec_1",
      ...DEFAULT_SECTION,
      items: [{ id: "item_1", ...DEFAULT_ITEM }]
    }
  ]);

  const [activeSectionId, setActiveSectionId] = useState<string>("sec_1");

  const activeSectionIndex = sections.findIndex(s => s.id === activeSectionId);
  const activeSection = sections[activeSectionIndex];

  const addSection = () => {
    const newId = `sec_${Date.now()}`;
    setSections([...sections, {
      id: newId,
      ...DEFAULT_SECTION,
      items: [{ id: `item_${Date.now()}`, ...DEFAULT_ITEM }]
    }]);
    setActiveSectionId(newId);
  };

  const removeSection = (idToRemove: string) => {
    if (sections.length <= 1) return;
    const newSections = sections.filter(s => s.id !== idToRemove);
    setSections(newSections);
    if (activeSectionId === idToRemove) {
      setActiveSectionId(newSections[0].id);
    }
  };

  const updateSectionField = (field: keyof Omit<GashaponSection, "id" | "items">, value: string) => {
    if (activeSectionIndex === -1) return;
    const newSections = [...sections];
    newSections[activeSectionIndex] = {
      ...newSections[activeSectionIndex],
      [field]: value
    };
    setSections(newSections);
  };

  const addItem = () => {
    if (activeSectionIndex === -1) return;
    const newSections = [...sections];
    newSections[activeSectionIndex].items.push({
      id: `item_${Date.now()}`,
      ...DEFAULT_ITEM
    });
    setSections(newSections);
  };

  const removeItem = (itemIndex: number) => {
    if (activeSectionIndex === -1) return;
    const newSections = [...sections];
    newSections[activeSectionIndex].items.splice(itemIndex, 1);
    setSections(newSections);
  };

  const updateItemField = (itemIndex: number, field: keyof Omit<PresentItem, "id">, value: string) => {
    if (activeSectionIndex === -1) return;
    const newSections = [...sections];
    newSections[activeSectionIndex].items[itemIndex] = {
      ...newSections[activeSectionIndex].items[itemIndex],
      [field]: value
    };
    setSections(newSections);
  };

  const generateINI = () => {
    let iniStr = `[Common]\n`;
    iniStr += `Change\t=\t1\n`;
    iniStr += `MaxInfo\t=\t${sections.length}\n\n`;

    sections.forEach((section, index) => {
      const secNum = index + 1;
      iniStr += `[GashaponPresent${secNum}]\n\n`;
      iniStr += `EtcItemType\t=\t${section.EtcItemType}\n`;
      iniStr += `PresentSendID\t=\t${section.PresentSendID}\n`;
      iniStr += `PresentAlarm\t=\t${section.PresentAlarm}\n`;
      iniStr += `PresentMent\t=\t${section.PresentMent}\n`;
      iniStr += `PresentPeriod\t=\t${section.PresentPeriod}\n\n`;
      iniStr += `MaxItem\t=\t${section.items.length}\n\n`;

      section.items.forEach((item, itemIdx) => {
        const itemNum = itemIdx + 1;
        iniStr += `Gashapon${itemNum}_Rand\t=\t${item.Rand}\n`;
        iniStr += `Whole${itemNum}_Alarm\t=\t${item.Whole_Alarm}\n`;
        iniStr += `Present${itemNum}_Type\t=\t${item.Type}\n`;
        iniStr += `Present${itemNum}_Value1\t=\t${item.Value1}\n`;
        iniStr += `Present${itemNum}_Value2\t=\t${item.Value2}\n`;
        iniStr += `Present${itemNum}_Peso\t=\t${item.Peso}\n\n`;
      });
    });

    return iniStr.trim();
  };

  const copyToClipboard = () => {
    const text = generateINI();
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="flex flex-col gap-2 mb-6 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Gift className="w-8 h-8 text-indigo-500" />
          Gashapon Generator
        </h1>
        <p className="text-muted-foreground font-medium">
          Generate configuration for sp2_gashapon_present.ini
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_400px] gap-6 flex-1 min-h-0">
        {/* Left Sidebar - Sections List */}
        <Card className="flex flex-col overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="py-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Gashapon Groups</CardTitle>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={addSection}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar flex flex-col gap-1">
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                  activeSectionId === sec.id
                    ? "bg-indigo-500/10 text-indigo-500"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <span>[GashaponPresent{idx + 1}]</span>
                {sections.length > 1 && (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive opacity-0 hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSection(sec.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Center Panel - Edit Active Section */}
        {activeSection ? (
          <Card className="flex flex-col overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="py-4 border-b border-border/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">[GashaponPresent{activeSectionIndex + 1}]</CardTitle>
                <CardDescription>Configure general section properties</CardDescription>
              </div>
            </CardHeader>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">EtcItemType</label>
                  <Input 
                    value={activeSection.EtcItemType} 
                    onChange={e => updateSectionField("EtcItemType", e.target.value)}
                    className="bg-background/50 h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">PresentSendID</label>
                  <Input 
                    value={activeSection.PresentSendID} 
                    onChange={e => updateSectionField("PresentSendID", e.target.value)}
                    className="bg-background/50 h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">PresentAlarm</label>
                  <Input 
                    value={activeSection.PresentAlarm} 
                    onChange={e => updateSectionField("PresentAlarm", e.target.value)}
                    className="bg-background/50 h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">PresentMent</label>
                  <Input 
                    value={activeSection.PresentMent} 
                    onChange={e => updateSectionField("PresentMent", e.target.value)}
                    className="bg-background/50 h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">PresentPeriod (Days)</label>
                  <Input 
                    value={activeSection.PresentPeriod} 
                    onChange={e => updateSectionField("PresentPeriod", e.target.value)}
                    className="bg-background/50 h-8"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Reward Items ({activeSection.items.length})</h3>
                <Button size="sm" variant="secondary" onClick={addItem} className="h-7 text-xs">
                  <Plus className="w-3 h-3 mr-1" /> Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {activeSection.items.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-zinc-950/50 rounded-lg border border-border/50 relative group">
                    <div className="absolute -left-2.5 top-3 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-[10px] font-bold border border-indigo-500/30">
                      {idx + 1}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:bg-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeItem(idx)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                    
                    <div className="grid grid-cols-3 gap-3 ml-4 pr-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Rand (Rate)</label>
                        <Input value={item.Rand} onChange={e => updateItemField(idx, "Rand", e.target.value)} className="h-7 text-xs bg-background/50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Type</label>
                        <Input value={item.Type} onChange={e => updateItemField(idx, "Type", e.target.value)} className="h-7 text-xs bg-background/50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Value1 (ItemCode)</label>
                        <Input value={item.Value1} onChange={e => updateItemField(idx, "Value1", e.target.value)} className="h-7 text-xs bg-background/50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Value2 (Time/Amt)</label>
                        <Input value={item.Value2} onChange={e => updateItemField(idx, "Value2", e.target.value)} className="h-7 text-xs bg-background/50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Peso</label>
                        <Input value={item.Peso} onChange={e => updateItemField(idx, "Peso", e.target.value)} className="h-7 text-xs bg-background/50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Whole_Alarm</label>
                        <Input value={item.Whole_Alarm} onChange={e => updateItemField(idx, "Whole_Alarm", e.target.value)} className="h-7 text-xs bg-background/50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ) : (
          <div className="flex items-center justify-center bg-card/30 rounded-xl border border-border/50 text-muted-foreground">
            Select or create a Gashapon group
          </div>
        )}

        {/* Right Sidebar - Preview & Export */}
        <Card className="flex flex-col overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader className="py-4 border-b border-border/50 bg-zinc-950/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-indigo-500" />
                INI Output
              </CardTitle>
              <Button size="sm" onClick={copyToClipboard} className="h-7 text-xs bg-indigo-500 hover:bg-indigo-600 text-white">
                <Copy className="w-3 h-3 mr-2" /> Copy
              </Button>
            </div>
          </CardHeader>
          <div className="flex-1 overflow-hidden p-0 relative group">
            <textarea
              readOnly
              value={generateINI()}
              className="w-full h-full bg-zinc-950/80 text-zinc-300 p-4 font-mono text-xs resize-none focus:outline-none custom-scrollbar"
              spellCheck={false}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
