"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Compass,
  CheckCircle2,
  ChevronRight,
  FileCode2,
  Copy,
  Eye,
  EyeOff,
  Scroll,
  Calendar,
  Target,
  Gift,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface MainQuest {
  quest_id: string;
  class_name: string;
  main_index: string;
  max_sub_quest: string;
}

interface SubQuest {
  title: string;
  icon: string;
  progress: string;
  progress_result: string;
  help: string;
  perform_type: string;
  channeling_type: string;
  pcroom_style: string;
  start_year: string;
  start_month: string;
  start_date: string;
  start_hour: string;
  end_year: string;
  end_month: string;
  end_date: string;
  end_hour: string;
  occur_value: string;
  complete_value: string;
  period_hour: string;
  max_reward: string;
  reward_present1: string;
  reward_present2: string;
  reward_present3: string;
  reward_present4: string;
}

const DEFAULT_SUB_QUEST: SubQuest = {
  title: "STR(1)",
  icon: "UIIconPack30#goods_itemgrowup",
  progress: "STR(2)",
  progress_result: "STR(3)",
  help: "11",
  perform_type: "2",
  channeling_type: "-1",
  pcroom_style: "0",
  start_year: "2025",
  start_month: "1",
  start_date: "24",
  start_hour: "9",
  end_year: "2025",
  end_month: "1",
  end_date: "25",
  end_hour: "9",
  occur_value: "1",
  complete_value: "19",
  period_hour: "0",
  max_reward: "2",
  reward_present1: "10301",
  reward_present2: "10611",
  reward_present3: "",
  reward_present4: "",
};

// ─── Game Quest Preview ────────────────────────────────────────────────────────
function QuestOccurPreview({ sub }: { sub: SubQuest }) {
  const maxReward = parseInt(sub.max_reward) || 0;
  const rewards = [sub.reward_present1, sub.reward_present2, sub.reward_present3, sub.reward_present4];

  return (
    <div
      className="select-none font-sans"
      style={{
        width: 435,
        transform: "scale(0.82)",
        transformOrigin: "top center",
        marginBottom: "-80px",
      }}
    >
      <div
        style={{
          width: 435,
          background: "linear-gradient(180deg, #7a5c3a 0%, #5c3e22 4%, #3d2810 8%, #4a3218 50%, #3a2510 96%, #2e1e0a 100%)",
          border: "2px solid #8b6840",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: "linear-gradient(180deg, #7a5028 0%, #5a3318 50%, #4a2810 100%)",
            borderBottom: "1px solid #8b5a20",
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 40px",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", left: 5, top: 6, width: 10, height: 10, borderTop: "2px solid #c89050", borderLeft: "2px solid #c89050" }} />
          <div style={{ position: "absolute", right: 5, top: 6, width: 10, height: 10, borderTop: "2px solid #c89050", borderRight: "2px solid #c89050" }} />
          <span style={{ color: "#fff", fontSize: 17, fontWeight: "bold", textShadow: "1px 1px 0 #000, -1px -1px 0 #000", letterSpacing: 0.5 }}>
            {sub.title || "Quest Title"}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: "8px 0" }}>
          <div style={{ display: "flex", padding: "0 12px", gap: 10, minHeight: 60 }}>
            <div style={{ flexShrink: 0, position: "relative" }}>
              <div style={{
                width: 52, height: 52,
                background: "#3a2010", border: "2px solid #8b6030", borderRadius: 4,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 20 }}>🎯</span>
              </div>
              <div style={{
                position: "absolute", top: -4, left: -4,
                background: "linear-gradient(180deg, #50c840 0%, #28a018 100%)",
                border: "1px solid #1a7010", borderRadius: 3,
                padding: "1px 5px", fontSize: 9, fontWeight: "bold", color: "#fff", letterSpacing: 1,
              }}>NEW</div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
              {[sub.progress, sub.progress_result, ""].map((line, i) => (
                <div key={i} style={{
                  borderBottom: "1px solid rgba(200,160,80,0.2)", padding: "3px 2px",
                  fontSize: 12, color: line ? "#e8d8b8" : "transparent",
                  textShadow: "0 1px 2px rgba(0,0,0,0.9)", minHeight: 21,
                }}>
                  {line || " "}
                </div>
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`e-${i}`} style={{ borderBottom: "1px solid rgba(200,160,80,0.15)", minHeight: 21 }} />
              ))}
            </div>
          </div>

          <div style={{ margin: "6px 0", height: 1, background: "linear-gradient(90deg, transparent 0%, #8b6030 20%, #c89050 50%, #8b6030 80%, transparent 100%)" }} />

          <div style={{ background: "rgba(0,0,0,0.35)", padding: "8px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{
                background: "linear-gradient(180deg, #d03020 0%, #901808 100%)",
                border: "1px solid #601008", borderRadius: 3,
                padding: "1px 8px", fontSize: 10, fontWeight: "bold", color: "#fff", flexShrink: 0,
              }}>Goal</div>
              <span style={{ fontSize: 12, color: "#e87830", fontWeight: "bold", textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}>
                {sub.progress || "Complete quest objectives"}&nbsp;
                <span style={{ color: "#ff6020" }}>0/{sub.complete_value} Items</span>
              </span>
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              {Array.from({ length: 5 }).map((_, i) => {
                const hasReward = i < maxReward && rewards[i];
                return (
                  <div key={i} style={{
                    width: 77, height: 77,
                    background: hasReward ? "#3a2408" : "#1a1510",
                    border: `1px solid ${hasReward ? "#8b6030" : "#4a3828"}`,
                    borderRadius: 3,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                    overflow: "hidden",
                  }}>
                    {hasReward ? (
                      <>
                        <span style={{ fontSize: 22 }}>
                          {i === 0 ? "⚡" : i === 1 ? "🌙" : i === 2 ? "🏅" : "🎁"}
                        </span>
                        <span style={{ fontSize: 9, color: "#c8a060", textAlign: "center", lineHeight: 1.2, padding: "0 2px" }}>
                          {i === 0 ? "EXP Rank\n1,000 EXP" : i === 1 ? "U.Lunar\n50 item" : `#${rewards[i]}`}
                        </span>
                      </>
                    ) : (
                      <>
                        <div style={{ width: 24, height: 24, position: "relative", opacity: 0.3 }}>
                          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: "#666", transform: "rotate(45deg)" }} />
                          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: "#666", transform: "rotate(-45deg)" }} />
                        </div>
                        <span style={{ fontSize: 9, color: "#444" }}>Reward {i + 1}</span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ padding: "8px 17px 0" }}>
            <div style={{
              height: 31,
              background: "linear-gradient(180deg, #6a4820 0%, #4a2e10 50%, #3a2008 100%)",
              border: "1px solid #8b5820", borderRadius: 3,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: "bold", textShadow: "1px 1px 0 #000, -1px -1px 0 #000" }}>
                Tutup (SPACE)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      {icon && <span className="text-zinc-500">{icon}</span>}
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-zinc-800" />
    </div>
  );
}

// ─── Field ─────────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Input style ───────────────────────────────────────────────────────────────
const inputCls =
  "font-mono text-xs h-8 bg-zinc-900 border-zinc-700/60 text-zinc-200 placeholder:text-zinc-600 " +
  "focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/70 rounded-md transition-colors";

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function QuestGeneratorPage() {
  const [mainQuest, setMainQuest] = useState<MainQuest>({
    quest_id: "1",
    class_name: "QuestExtraItemReinforceSuccess",
    main_index: "1",
    max_sub_quest: "9",
  });

  const [subQuests, setSubQuests] = useState<SubQuest[]>(
    Array.from({ length: 9 }, () => ({ ...DEFAULT_SUB_QUEST }))
  );

  const [activeTab, setActiveTab] = useState<"main" | "sub">("main");
  const [activeSubIdx, setActiveSubIdx] = useState(0);
  const [generatedOutput, setGeneratedOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const updateMainQuest = (key: keyof MainQuest, val: string) => {
    setMainQuest(prev => ({ ...prev, [key]: val }));
    if (key === "max_sub_quest") {
      const n = parseInt(val) || 0;
      if (n > 0 && n <= 100) {
        setSubQuests(prev => {
          if (n > prev.length) return [...prev, ...Array.from({ length: n - prev.length }, () => ({ ...DEFAULT_SUB_QUEST }))];
          if (n < prev.length) return prev.slice(0, n);
          return prev;
        });
      }
    }
  };

  const updateSubQuest = (idx: number, key: keyof SubQuest, val: string) => {
    setSubQuests(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: val };
      return next;
    });
  };

  const handleGenerate = () => {
    let output = `[quest${mainQuest.quest_id}]
class_name\t=\t${mainQuest.class_name}
main_index\t=\t${mainQuest.main_index}
max_sub_quest\t=\t${mainQuest.max_sub_quest}
`;
    subQuests.forEach((sq, idx) => {
      const p = `sub${idx + 1}_`;
      output += `\t\t
${p}title\t=\t${sq.title}
${p}icon\t=\t${sq.icon}
${p}progress\t=\t${sq.progress}
${p}progress_result\t=\t${sq.progress_result}
${p}help\t=\t${sq.help}
${p}perform_type\t=\t${sq.perform_type}
${p}channeling_type\t=\t${sq.channeling_type}
${p}pcroom_style\t=\t${sq.pcroom_style}

${p}start_year\t=\t${sq.start_year}
${p}start_month\t=\t${sq.start_month}
${p}start_hour\t=\t${sq.start_hour}\t\t
${p}start_date\t=\t${sq.start_date}
${p}end_year\t=\t${sq.end_year}
${p}end_month\t=\t${sq.end_month}
${p}end_hour\t=\t${sq.end_hour}\t\t
${p}end_date\t=\t${sq.end_date}

\t\t
${p}occur_value\t=\t${sq.occur_value}
${p}complete_value\t=\t${sq.complete_value}
${p}period_hour\t=\t${sq.period_hour}

\t\t
${p}max_reward\t=\t${sq.max_reward}
${p}reward_present1\t=\t${sq.reward_present1}
${p}reward_present2\t=\t${sq.reward_present2}
${p}reward_present3\t=\t${sq.reward_present3}
${p}reward_present4\t=\t${sq.reward_present4}
`;
    });
    setGeneratedOutput(output);
    setCopied(false);
  };

  const currentSub = subQuests[activeSubIdx] ?? DEFAULT_SUB_QUEST;

  return (
    <div className="flex flex-col flex-1 p-6 h-full bg-background overflow-hidden">

      {/* ── Header ── */}
      <div className="mb-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-[3px] h-7 bg-zinc-500 rounded-full" />
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none mb-1 text-zinc-100">Quest Generator</h1>
            <p className="text-zinc-500 text-xs">
              Generator untuk{" "}
              <code className="font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded text-[11px]">
                sp2_quest_info.ini
              </code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(p => !p)}
            className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-md border transition-colors ${
              showPreview
                ? "border-zinc-600 text-zinc-300 bg-zinc-800"
                : "border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600"
            }`}
          >
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 h-8 px-4 text-xs font-semibold rounded-md bg-zinc-100 hover:bg-white text-zinc-900 transition-colors"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            Generate INI
          </button>
        </div>
      </div>

      {/* ── 3-column grid ── */}
      <div
        className="flex-1 grid gap-3 min-h-0"
        style={{ gridTemplateColumns: showPreview ? "210px 1fr 360px" : "210px 1fr" }}
      >

        {/* ── LEFT: Navigation ── */}
        <div className="flex flex-col min-h-0 border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden">

          {/* Tab switch */}
          <div className="p-2 border-b border-zinc-800 shrink-0">
            <div className="grid grid-cols-2 h-8 bg-zinc-900 rounded-md p-0.5 gap-0.5">
              {(["main", "sub"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] uppercase font-bold tracking-widest rounded transition-colors ${
                    activeTab === tab
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab === "main" ? "Main" : "Sub"}
                </button>
              ))}
            </div>
          </div>

          {/* Nav content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "main" && (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center gap-2">
                <Compass className="w-7 h-7 text-zinc-700" />
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  Konfigurasi parameter induk Quest.
                </p>
              </div>
            )}

            {activeTab === "sub" && (
              <div className="p-1.5 space-y-px">
                {subQuests.map((_, idx) => {
                  const isActive = activeSubIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveSubIdx(idx)}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-colors group ${
                        isActive
                          ? "bg-zinc-800 text-zinc-100"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isActive ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-medium">Sub Quest {idx + 1}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── CENTER: Editor ── */}
        <div className="flex flex-col min-h-0 border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden">

          {/* Panel header */}
          <div className="px-5 py-3 border-b border-zinc-800 shrink-0 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 leading-none">
                {activeTab === "main" ? "Main Quest" : `Sub Quest ${activeSubIdx + 1}`}
              </h2>
              <p className="text-[11px] text-zinc-600 mt-0.5">
                {activeTab === "main" ? "Parameter induk quest block" : `sub${activeSubIdx + 1}_* fields`}
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">

            {/* ── MAIN QUEST ── */}
            {activeTab === "main" && (
              <div className="space-y-7">
                <div>
                  <SectionHeader label="Quest Identity" icon={<Scroll className="w-3.5 h-3.5" />} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Quest ID [questX]" accent>
                      <Input value={mainQuest.quest_id} onChange={e => updateMainQuest("quest_id", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Class Name">
                      <Input value={mainQuest.class_name} onChange={e => updateMainQuest("class_name", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Main Index">
                      <Input value={mainQuest.main_index} onChange={e => updateMainQuest("main_index", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Max Sub Quest" accent>
                      <Input value={mainQuest.max_sub_quest} onChange={e => updateMainQuest("max_sub_quest", e.target.value)} className={inputCls} type="number" min="1" />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* ── SUB QUEST ── */}
            {activeTab === "sub" && (
              <div className="space-y-7">

                {/* Display Info */}
                <div>
                  <SectionHeader label="Display Info" icon={<Scroll className="w-3.5 h-3.5" />} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Title">
                      <Input value={currentSub.title} onChange={e => updateSubQuest(activeSubIdx, "title", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Icon">
                      <Input value={currentSub.icon} onChange={e => updateSubQuest(activeSubIdx, "icon", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Progress String">
                      <Input value={currentSub.progress} onChange={e => updateSubQuest(activeSubIdx, "progress", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Progress Result">
                      <Input value={currentSub.progress_result} onChange={e => updateSubQuest(activeSubIdx, "progress_result", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Help">
                      <Input value={currentSub.help} onChange={e => updateSubQuest(activeSubIdx, "help", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Perform Type">
                      <Input value={currentSub.perform_type} onChange={e => updateSubQuest(activeSubIdx, "perform_type", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Channeling">
                      <Input value={currentSub.channeling_type} onChange={e => updateSubQuest(activeSubIdx, "channeling_type", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="PC Room">
                      <Input value={currentSub.pcroom_style} onChange={e => updateSubQuest(activeSubIdx, "pcroom_style", e.target.value)} className={inputCls} />
                    </Field>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <SectionHeader label="Timeline" icon={<Calendar className="w-3.5 h-3.5" />} />
                  <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
                    <div className="grid grid-cols-4 gap-3">
                      {([
                        ["Start Year", "start_year"], ["Start Month", "start_month"],
                        ["Start Date", "start_date"], ["Start Hour", "start_hour"],
                        ["End Year",   "end_year"],   ["End Month",   "end_month"],
                        ["End Date",   "end_date"],   ["End Hour",    "end_hour"],
                      ] as [string, keyof SubQuest][]).map(([label, key]) => (
                        <Field key={key} label={label} accent>
                          <Input
                            value={(currentSub as unknown as Record<string, string>)[key]}
                            onChange={e => updateSubQuest(activeSubIdx, key, e.target.value)}
                            className={inputCls}
                          />
                        </Field>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Target Values */}
                <div>
                  <SectionHeader label="Target Values" icon={<Target className="w-3.5 h-3.5" />} />
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      ["Occur Value",    "occur_value"],
                      ["Complete Value", "complete_value"],
                      ["Period Hour",    "period_hour"],
                    ] as [string, keyof SubQuest][]).map(([label, key]) => (
                      <Field key={key} label={label}>
                        <Input
                          value={(currentSub as unknown as Record<string, string>)[key]}
                          onChange={e => updateSubQuest(activeSubIdx, key, e.target.value)}
                          className={inputCls}
                        />
                      </Field>
                    ))}
                  </div>
                </div>

                {/* Rewards */}
                <div>
                  <SectionHeader label="Rewards" icon={<Gift className="w-3.5 h-3.5" />} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Max Reward" accent>
                      <Input value={currentSub.max_reward} onChange={e => updateSubQuest(activeSubIdx, "max_reward", e.target.value)} className={inputCls} />
                    </Field>
                    {(["reward_present1", "reward_present2", "reward_present3", "reward_present4"] as (keyof SubQuest)[]).map((key, i) => (
                      <Field key={key} label={`Reward ${i + 1}`}>
                        <Input
                          value={(currentSub as unknown as Record<string, string>)[key]}
                          onChange={e => updateSubQuest(activeSubIdx, key, e.target.value)}
                          className={inputCls}
                        />
                      </Field>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Preview + Output ── */}
        {showPreview && (
          <div className="flex flex-col gap-3 h-full min-h-0">

            {/* Game Preview */}
            <div className="border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden shrink-0">
              <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <Eye className="w-3 h-3" />
                  Game Preview
                </span>
                <span className="text-[10px] text-zinc-700 font-mono">
                  Sub {activeTab === "sub" ? activeSubIdx + 1 : 1}
                </span>
              </div>
              <div className="flex justify-center overflow-hidden bg-zinc-950 p-2" style={{ minHeight: 310 }}>
                <QuestOccurPreview
                  sub={activeTab === "sub" ? currentSub : subQuests[0] ?? DEFAULT_SUB_QUEST}
                />
              </div>
            </div>

            {/* Output INI */}
            <div className="border border-zinc-800 rounded-lg bg-zinc-950 flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <FileCode2 className="w-3 h-3" />
                  Output INI
                </span>
                <button
                  onClick={() => {
                    if (!generatedOutput) return;
                    navigator.clipboard.writeText(generatedOutput);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-medium rounded border transition-colors ${
                    copied
                      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/8"
                      : "border-zinc-700 text-zinc-500 hover:text-zinc-200 hover:border-zinc-600"
                  }`}
                >
                  {copied
                    ? <><CheckCircle2 className="w-3 h-3" /> Copied</>
                    : <><Copy className="w-3 h-3" /> Copy</>
                  }
                </button>
              </div>

              <div className="flex-1 relative overflow-hidden">
                {!generatedOutput && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 z-10 pointer-events-none gap-2">
                    <FileCode2 className="w-6 h-6" />
                    <p className="text-xs">Klik Generate INI terlebih dahulu</p>
                  </div>
                )}
                <textarea
                  className="w-full h-full bg-transparent border-0 resize-none font-mono text-[11px] leading-relaxed p-4 text-zinc-400 focus:outline-none"
                  readOnly
                  value={generatedOutput}
                  placeholder=""
                  spellCheck={false}
                />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
