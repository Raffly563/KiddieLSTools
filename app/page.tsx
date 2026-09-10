import Link from "next/link";
import {
  Settings,
  Package,
  Activity,
  FileEdit,
  AlertCircle,
  CalendarDays,
  Store,
  Dices,
  Trophy,
  Medal,
  Ticket,
  Compass,
  Gift,
  Box,
  Music,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: "success" | "danger" | "default";
}

function StatCard({ label, value, sub, accent = "default" }: StatCardProps) {
  const accentColor =
    accent === "success"
      ? "text-emerald-500"
      : accent === "danger"
      ? "text-red-500"
      : "text-foreground";

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        {label}
      </p>
      <p className={`text-2xl font-bold tabular-nums ${accentColor}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

interface ModuleCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

function ModuleCard({ href, icon: Icon, title, description }: ModuleCardProps) {
  return (
    <Link
      href={href}
      className="group bg-card border border-border rounded-lg p-5 flex flex-col gap-4 hover:border-border/80 hover:bg-card/80 transition-all duration-150"
    >
      <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-150">
        <Icon className="w-4.5 h-4.5 text-muted-foreground group-hover:text-primary transition-colors duration-150" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors duration-150">
        Open
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

const modules: ModuleCardProps[] = [
  {
    href: "/ini-editor",
    icon: Settings,
    title: "INI Editor",
    description: "Edit configuration files with syntax highlighting and real-time validation.",
  },
  {
    href: "/item-manager",
    icon: Package,
    title: "Item Manager",
    description: "Browse, search, and manage game item definitions and attributes.",
  },
  {
    href: "/model-viewer",
    icon: Box,
    title: "3D Model Viewer",
    description: "Preview DDS textures and 3D character models in the browser.",
  },
  {
    href: "/attendance-generator",
    icon: CalendarDays,
    title: "Attendance Gen",
    description: "Generate sp2_attendance_reward.ini with a visual calendar builder.",
  },
  {
    href: "/shop-editor",
    icon: Store,
    title: "Shop Manager",
    description: "Live-edit 300k+ lines of sp2_etcitem_info.ini with instant search.",
  },
  {
    href: "/bingo-generator",
    icon: Dices,
    title: "Bingo Generator",
    description: "Configure sp2_bingo.ini — define board layouts and line rewards.",
  },
  {
    href: "/tournament-generator",
    icon: Trophy,
    title: "Tournament Gen",
    description: "Build sp2_custom_tournament_reward.ini reward structures visually.",
  },
  {
    href: "/medal-generator",
    icon: Medal,
    title: "Medal Gen",
    description: "Single-block generator for sp2_medalitem_info.ini medal entries.",
  },
  {
    href: "/mileage-generator",
    icon: Ticket,
    title: "Mileage Gen",
    description: "Configure sp2_mileage_goods.ini and build your mileage reward shop.",
  },
  {
    href: "/quest-generator",
    icon: Compass,
    title: "Quest Gen",
    description: "Build nested quest chains for sp2_quest_info.ini safely.",
  },
  {
    href: "/gashapon-generator",
    icon: Gift,
    title: "Gashapon Gen",
    description: "Configure gashapon drop tables and probability distributions.",
  },
  {
    href: "/wave-player",
    icon: Music,
    title: "Wave Player",
    description: "Play and preview .wav game audio files directly in the browser.",
  },
];

const activityLog = [
  { action: "Edit", file: "costumecollection.ini", user: "Superadmin", time: "Just now", type: "edit" },
  { action: "Edit", file: "item_equip.ini", user: "Superadmin", time: "2h ago", type: "edit" },
  { action: "System", file: "server_config.xml", user: "System", time: "5h ago", type: "system" },
  { action: "Generate", file: "sp2_attendance_reward.ini", user: "Superadmin", time: "1d ago", type: "generate" },
];

const systemLog = [
  { time: "14:32:01", message: "Session started for Admin User" },
  { time: "14:31:55", message: "Database connection verified" },
  { time: "14:30:12", message: "Backup sequence completed successfully" },
  { time: "14:22:08", message: "File watcher initialized on /config" },
];

export default function Home() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">

      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Lost Saga developer workspace overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-8 px-3 text-xs font-semibold border border-border rounded bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            Generate Report
          </button>
          <button className="h-8 px-3 text-xs font-semibold rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            New Project
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              System Status
            </p>
            <Activity className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-bold text-emerald-500 tracking-widest">ONLINE</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">All services operational</p>
        </div>

        <StatCard label="Active Projects" value="3" sub="Last updated today" />
        <StatCard label="Files Modified (24H)" value="124" sub="+18 from yesterday" />

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Active Errors
            </p>
            <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold text-foreground">0 errors</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">No issues detected</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: modules + activity */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* Modules grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Available Modules
              </h2>
              <span className="text-xs text-muted-foreground">{modules.length} total</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {modules.map((mod) => (
                <ModuleCard key={mod.href} {...mod} />
              ))}
            </div>
          </section>

          {/* Activity table */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Recent Activity
              </h2>
              <button className="text-xs font-semibold text-primary hover:underline underline-offset-2">
                View all
              </button>
            </div>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Action
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      File
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hidden sm:table-cell">
                      User
                    </th>
                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground text-right">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activityLog.map((entry, i) => (
                    <tr key={i} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                            <FileEdit className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                            {entry.action}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {entry.file}
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground hidden sm:table-cell">
                        {entry.user}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[11px] text-muted-foreground">
                        {entry.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right: system log + quick stats */}
        <div className="flex flex-col gap-4">

          {/* System log */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                System Log
              </span>
            </div>
            <div className="divide-y divide-border">
              {systemLog.map((entry, i) => (
                <div key={i} className="px-4 py-3 flex gap-3 hover:bg-muted/20 transition-colors">
                  <span className="font-mono text-[11px] text-primary shrink-0">[{entry.time}]</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{entry.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Module usage */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Module Usage
              </span>
            </div>
            <div className="divide-y divide-border">
              {[
                { name: "INI Editor", uses: 84, pct: 84 },
                { name: "Shop Manager", uses: 61, pct: 61 },
                { name: "Item Manager", uses: 47, pct: 47 },
                { name: "Attendance Gen", uses: 29, pct: 29 },
              ].map((item) => (
                <div key={item.name} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-foreground">{item.name}</span>
                    <span className="text-[11px] font-mono text-muted-foreground">{item.uses}</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/70 rounded-full"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Build info */}
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Environment
            </p>
            <div className="flex flex-col gap-2">
              {[
                { key: "Version", value: "1.4.2" },
                { key: "Next.js", value: "16.2.10" },
                { key: "Build", value: "2026.09.10" },
                { key: "Node", value: "22.x" },
              ].map(({ key, value }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{key}</span>
                  <span className="font-mono text-xs text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
