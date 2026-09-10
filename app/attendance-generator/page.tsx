"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Save, Download, Settings2, Sparkles, RefreshCw, ChevronRight } from "lucide-react";

interface RewardDay {
  type: string;
  value1: string;
  value2: string;
  hidden: string;
}

export default function AttendanceGeneratorPage() {
  const [loadDate, setLoadDate] = useState("1502");
  const [daysCount, setDaysCount] = useState(28);
  const [activeDay, setActiveDay] = useState(0); // Index of the currently selected day
  
  // Initialize default rewards
  const [rewards, setRewards] = useState<RewardDay[]>(
    Array(28).fill({ type: "3", value1: "1000000", value2: "1", hidden: "0" })
  );

  const [generatedOutput, setGeneratedOutput] = useState("");

  const handleDayCountChange = (newCount: number) => {
    setDaysCount(newCount);
    setRewards(prev => {
      if (newCount > prev.length) {
        return [...prev, ...Array(newCount - prev.length).fill({ type: "3", value1: "1000000", value2: "1", hidden: "0" })];
      }
      return prev.slice(0, newCount);
    });
    // Reset active day if the current active day is now out of bounds
    if (activeDay >= newCount) {
      setActiveDay(newCount - 1);
    }
  };

  const updateReward = (field: keyof RewardDay, value: string) => {
    setRewards(prev => {
      const newRewards = [...prev];
      newRewards[activeDay] = { ...newRewards[activeDay], [field]: value };
      return newRewards;
    });
  };

  const generateINI = () => {
    let output = `[${loadDate}]\n`;
    rewards.forEach((reward, index) => {
      const day = index + 1;
      output += `today_reward${day}_type\t=\t${reward.type}\n`;
      output += `today_reward${day}_value1\t=\t${reward.value1}\n`;
      output += `today_reward${day}_value2\t=\t${reward.value2}\n`;
      output += `today_reward${day}_hidden\t=\t${reward.hidden}\n\t\t\t\n`;
    });
    setGeneratedOutput(output);
  };

  const currentReward = rewards[activeDay] || { type: "", value1: "", value2: "", hidden: "" };

  return (
    <div className="flex flex-col flex-1 p-8 h-full bg-background">
      <div className="mb-6 flex items-center gap-3 shrink-0">
        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Attendance Generator</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Generate <span className="font-mono text-primary/80">sp2_attendance_reward.ini</span> configurations visually.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 pb-8">
        
        {/* Left / Main Configuration Column */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full min-h-0">
          
          {/* Global Settings */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm shrink-0">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" /> Global Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Load Date (e.g. 1502)</label>
                <Input 
                  value={loadDate} 
                  onChange={(e) => setLoadDate(e.target.value)} 
                  className="font-mono bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Days in Month</label>
                <div className="flex gap-2">
                  {[28, 29, 30, 31].map(num => (
                    <Button 
                      key={num} 
                      variant={daysCount === num ? "default" : "outline"}
                      onClick={() => handleDayCountChange(num)}
                      className="flex-1"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Master-Detail Configuration */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-4 border-b border-border/50 flex flex-row items-center justify-between shrink-0">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" /> Daily Configuration
              </CardTitle>
              <Button onClick={generateINI} size="sm" className="gap-2 font-bold shadow-sm">
                <Sparkles className="w-4 h-4" />
                Generate INI
              </Button>
            </CardHeader>
            
            <div className="flex flex-1 min-h-0">
              {/* Master List (Left Sidebar inside Card) */}
              <div className="w-48 border-r border-border/50 flex flex-col min-h-0 bg-background/50">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest p-4 border-b border-border/50 shrink-0">
                  Select Day
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {rewards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveDay(index)}
                      className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-semibold transition-all flex items-center justify-between group ${
                        activeDay === index 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <span>Day {index + 1}</span>
                      {activeDay === index && <ChevronRight className="w-4 h-4 opacity-70" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail View (Right Form) */}
              <div className="flex-1 flex flex-col p-6 min-h-0 overflow-y-auto">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-tight">Day {activeDay + 1} Details</h3>
                  <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                    Item {activeDay + 1} of {daysCount}
                  </div>
                </div>

                <div className="space-y-6 max-w-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Type</label>
                      <Input 
                        value={currentReward.type} 
                        onChange={(e) => updateReward("type", e.target.value)} 
                        className="font-mono bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hidden</label>
                      <Input 
                        value={currentReward.hidden} 
                        onChange={(e) => updateReward("hidden", e.target.value)} 
                        className="font-mono bg-background"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Value 1 (Item ID / Peso)</label>
                    <Input 
                      value={currentReward.value1} 
                      onChange={(e) => updateReward("value1", e.target.value)} 
                      className="font-mono bg-background"
                    />
                    <p className="text-[10px] text-muted-foreground">Primary value, usually an Item Code or amount of Peso.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Value 2 (Qty / Duration)</label>
                    <Input 
                      value={currentReward.value2} 
                      onChange={(e) => updateReward("value2", e.target.value)} 
                      className="font-mono bg-background"
                    />
                    <p className="text-[10px] text-muted-foreground">Secondary value, such as amount of items or time duration.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right / Output Column */}
        <div className="flex flex-col gap-6 h-full min-h-0">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-4 border-b border-border/50 flex flex-row items-center justify-between shrink-0">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                Output INI
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-2 font-bold shadow-sm h-8" onClick={() => navigator.clipboard.writeText(generatedOutput)}>
                <Download className="w-3.5 h-3.5" />
                Copy
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative group overflow-hidden">
              {!generatedOutput && (
                <div className="absolute inset-0 flex items-center justify-center flex-col text-muted-foreground/50 z-10">
                  <RefreshCw className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm font-medium">Click Generate INI first</p>
                </div>
              )}
              <Textarea
                className="w-full h-full bg-transparent resize-none outline-none font-mono text-[11px] leading-relaxed border-0 focus-visible:ring-0 rounded-none p-6 text-foreground shadow-none"
                placeholder="; Generated output will appear here..."
                value={generatedOutput}
                readOnly
                spellCheck={false}
              />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
