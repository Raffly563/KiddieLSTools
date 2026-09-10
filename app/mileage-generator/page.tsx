"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Ticket, CheckCircle2, ChevronRight, FileCode2, Copy } from "lucide-react";

interface MileageCommon {
  max_goods: string;
}

interface MileageGoods {
  goods_index: string;
  need_etcitem_count: string;
  need_etcitem_code: string;
  goods_count: string;
  user_buy_count: string;
  PresentSendID: string;
  PresentType: string;
  PresentAlarm: string;
  PresentMent: string;
  PresentPeriod: string;
  PresentValue1: string;
  PresentValue2: string;
  ManualIndex: string;
  GoodsOrder: string;
  MarkType: string;
}

const DEFAULT_GOODS: MileageGoods = {
  goods_index: "200000",
  need_etcitem_count: "15000",
  need_etcitem_code: "1000050",
  goods_count: "29",
  user_buy_count: "-1",
  PresentSendID: "DeveloperK",
  PresentType: "5",
  PresentAlarm: "0",
  PresentMent: "1041",
  PresentPeriod: "7",
  PresentValue1: "111035",
  PresentValue2: "250000",
  ManualIndex: "11",
  GoodsOrder: "1",
  MarkType: "6",
};

export default function MileageGeneratorPage() {
  const [common, setCommon] = useState<MileageCommon>({
    max_goods: "49"
  });

  const [goods, setGoods] = useState<MileageGoods[]>(
    Array.from({ length: 49 }, (_, i) => ({ ...DEFAULT_GOODS, goods_index: (200000 + i).toString() }))
  );

  const [activeTab, setActiveTab] = useState("common");
  const [activeGoodsIdx, setActiveGoodsIdx] = useState(0);

  const [generatedOutput, setGeneratedOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const updateCommon = (key: keyof MileageCommon, val: string) => {
    setCommon(prev => ({ ...prev, [key]: val }));
    
    if (key === "max_goods") {
      const maxInt = parseInt(val) || 0;
      if (maxInt > 0 && maxInt <= 1000) {
        setGoods(prev => {
          if (maxInt > prev.length) {
            const extra = Array.from({ length: maxInt - prev.length }, (_, i) => ({ 
              ...DEFAULT_GOODS, 
              goods_index: (200000 + prev.length + i).toString() 
            }));
            return [...prev, ...extra];
          } else if (maxInt < prev.length) {
            return prev.slice(0, maxInt);
          }
          return prev;
        });
      }
    }
  };

  const updateGoods = (idx: number, key: keyof MileageGoods, val: string) => {
    const newArr = [...goods];
    newArr[idx] = { ...newArr[idx], [key]: val };
    setGoods(newArr);
  };

  const handleGenerate = () => {
    let output = `;8ġ : ġ, X
;9޴ : ڵ, Ⱓ(h)

;Ÿ
;MarkType    = 6 ()
;ManualIndex = 0 Ѵ.

max_goods\t=\t${common.max_goods}

`;

    goods.forEach((g, idx) => {
      output += `[goods${idx + 1}]

goods_index\t=\t${g.goods_index}

need_etcitem_count\t=\t${g.need_etcitem_count}
need_etcitem_code\t=\t${g.need_etcitem_code}
goods_count\t=\t${g.goods_count}
user_buy_count\t=\t${g.user_buy_count}

PresentSendID\t=\t${g.PresentSendID}
PresentType\t=\t${g.PresentType}
PresentAlarm\t=\t${g.PresentAlarm}
PresentMent\t=\t${g.PresentMent}
PresentPeriod\t=\t${g.PresentPeriod}
PresentValue1\t=\t${g.PresentValue1}
PresentValue2\t=\t${g.PresentValue2}
ManualIndex\t=\t${g.ManualIndex}
GoodsOrder\t=\t${g.GoodsOrder}
MarkType\t=\t${g.MarkType}

`;
    });

    setGeneratedOutput(output);
    setCopied(false);
  };

  return (
    <div className="flex flex-col flex-1 p-8 h-full bg-background overflow-hidden">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-rose-500 rounded-full"></div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Mileage Goods Gen</h1>
            <p className="text-muted-foreground text-sm font-medium">
              Generator visual untuk <span className="font-mono text-rose-500/80">sp2_mileage_goods.ini</span>.
            </p>
          </div>
        </div>
        <Button 
          onClick={handleGenerate} 
          className="bg-rose-600 hover:bg-rose-700 text-white shadow-sm font-bold gap-2"
        >
          <FileCode2 className="w-4 h-4" />
          Generate INI
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        <div className="lg:col-span-2 flex gap-6 h-full min-h-0">
          {/* LEFT PANEL */}
          <Card className="w-72 flex flex-col min-h-0 border-border/50 bg-card/50 backdrop-blur-sm shrink-0">
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-border/50 shrink-0">
                <div className="w-full grid grid-cols-2 h-9 bg-background/50 border border-border/50 rounded-md p-1 gap-1">
                  <button 
                    onClick={() => setActiveTab("common")}
                    className={`text-[10px] uppercase font-bold tracking-wider rounded-sm transition-all ${activeTab === 'common' ? 'bg-rose-500/10 text-rose-500 shadow-sm' : 'text-muted-foreground hover:bg-muted/50'}`}
                  >Global</button>
                  <button 
                    onClick={() => setActiveTab("goods")}
                    className={`text-[10px] uppercase font-bold tracking-wider rounded-sm transition-all ${activeTab === 'goods' ? 'bg-rose-500/10 text-rose-500 shadow-sm' : 'text-muted-foreground hover:bg-muted/50'}`}
                  >Goods</button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                {activeTab === "common" && (
                  <div className="p-4 text-center text-sm text-muted-foreground/70 flex flex-col items-center justify-center h-full">
                    <Ticket className="w-12 h-12 mb-4 opacity-20" />
                    Atur limit maksimal (max_goods) dari Mileage shop Anda.
                  </div>
                )}

                {activeTab === "goods" && (
                  <div className="space-y-1">
                    {goods.map((_, idx) => (
                      <button
                        key={`goods-${idx}`}
                        onClick={() => setActiveGoodsIdx(idx)}
                        className={`w-full text-left px-3 py-2.5 rounded-md transition-all flex items-center justify-between group ${
                          activeGoodsIdx === idx 
                          ? "bg-rose-500/10 border border-rose-500/20 text-rose-500" 
                          : "text-muted-foreground hover:bg-muted/50 border border-transparent"
                        }`}
                      >
                        <span className="text-xs font-bold uppercase tracking-wider">Goods {idx + 1}</span>
                        {activeGoodsIdx === idx && <ChevronRight className="w-4 h-4 opacity-70" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* RIGHT PANEL - Editor */}
          <Card className="flex-1 flex flex-col min-h-0 border-border/50 bg-card/50 backdrop-blur-sm shadow-sm relative overflow-hidden">
            
            <CardHeader className="p-6 border-b border-border/50 shrink-0 bg-background/50">
              <CardTitle className="text-xl font-bold tracking-tight text-rose-500 flex items-center gap-3">
                {activeTab === "common" && "Global Mileage Settings"}
                {activeTab === "goods" && `Mileage Goods [goods${activeGoodsIdx + 1}]`}
              </CardTitle>
              <CardDescription className="text-xs font-semibold mt-1">
                Ubah parameter di bawah ini secara real-time.
              </CardDescription>
            </CardHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {activeTab === "common" && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Max Goods</label>
                    <Input 
                      value={common.max_goods} 
                      onChange={(e) => updateCommon("max_goods", e.target.value)} 
                      className="font-mono text-xs bg-background/50 border-border/50 focus-visible:ring-rose-500"
                      type="number"
                      min="1"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Sistem akan secara otomatis meresize jumlah slot pada tab Goods berdasarkan nilai ini.</p>
                  </div>
                </div>
              )}

              {activeTab === "goods" && (
                <div className="space-y-8">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      Basic Configuration
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5 col-span-full">
                        <label className="text-[10px] font-bold text-rose-500/80 uppercase">Goods Index</label>
                        <Input 
                          value={goods[activeGoodsIdx].goods_index} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "goods_index", e.target.value)} 
                          className="font-mono text-xs border-rose-500/30 focus-visible:ring-rose-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Need Count</label>
                        <Input 
                          value={goods[activeGoodsIdx].need_etcitem_count} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "need_etcitem_count", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Need Code (Item)</label>
                        <Input 
                          value={goods[activeGoodsIdx].need_etcitem_code} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "need_etcitem_code", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Goods Count</label>
                        <Input 
                          value={goods[activeGoodsIdx].goods_count} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "goods_count", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">User Buy Count</label>
                        <Input 
                          value={goods[activeGoodsIdx].user_buy_count} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "user_buy_count", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Present Information */}
                  <div>
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      Present Delivery Settings
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Send ID</label>
                        <Input 
                          value={goods[activeGoodsIdx].PresentSendID} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "PresentSendID", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Type</label>
                        <Input 
                          value={goods[activeGoodsIdx].PresentType} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "PresentType", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Alarm</label>
                        <Input 
                          value={goods[activeGoodsIdx].PresentAlarm} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "PresentAlarm", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Ment</label>
                        <Input 
                          value={goods[activeGoodsIdx].PresentMent} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "PresentMent", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Period</label>
                        <Input 
                          value={goods[activeGoodsIdx].PresentPeriod} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "PresentPeriod", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Value 1</label>
                        <Input 
                          value={goods[activeGoodsIdx].PresentValue1} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "PresentValue1", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Value 2</label>
                        <Input 
                          value={goods[activeGoodsIdx].PresentValue2} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "PresentValue2", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div>
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      Metadata
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Manual Index</label>
                        <Input 
                          value={goods[activeGoodsIdx].ManualIndex} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "ManualIndex", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Goods Order</label>
                        <Input 
                          value={goods[activeGoodsIdx].GoodsOrder} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "GoodsOrder", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Mark Type</label>
                        <Input 
                          value={goods[activeGoodsIdx].MarkType} 
                          onChange={(e) => updateGoods(activeGoodsIdx, "MarkType", e.target.value)} 
                          className="font-mono text-xs bg-background/50"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </Card>
        </div>

        {/* OUTPUT COLUMN */}
        <div className="flex flex-col gap-6 h-full min-h-0">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-4 border-b border-border/50 flex flex-row items-center justify-between shrink-0">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                Output INI
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 font-bold shadow-sm h-8 hover:text-rose-500 hover:border-rose-500 transition-colors"
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
