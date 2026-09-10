import type { Metadata } from "next";
import { Outfit, Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronRight,
  CalendarDays,
  Store,
  Dices,
  Trophy,
  Medal,
  Ticket,
  Compass,
  Package,
  Box,
  Music,
  Gift,
  ChevronDown,
} from "lucide-react";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const notoJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Lost Saga Dev Tools",
  description: "Professional Developer Tools for Lost Saga",
};

const navItems = [
  { href: "/ini-editor", label: "INI Editor", icon: FileText },
  { href: "/item-manager", label: "Item Manager", icon: Package },
  { href: "/model-viewer", label: "3D Model Viewer", icon: Box },
  { href: "/attendance-generator", label: "Attendance Gen", icon: CalendarDays },
  { href: "/bingo-generator", label: "Bingo Gen", icon: Dices },
  { href: "/tournament-generator", label: "Tournament Gen", icon: Trophy },
  { href: "/medal-generator", label: "Medal Gen", icon: Medal },
  { href: "/mileage-generator", label: "Mileage Gen", icon: Ticket },
  { href: "/quest-generator", label: "Quest Gen", icon: Compass },
  { href: "/gashapon-generator", label: "Gashapon Gen", icon: Gift },
  { href: "/shop-editor", label: "Shop Manager", icon: Store },
  { href: "/wave-player", label: "Wave Player", icon: Music },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${notoJp.variable} h-full antialiased dark`}
    >
      <body className="h-screen w-screen flex bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-hidden">
        {/* Sidebar */}
        <aside
          className="w-60 flex-col hidden md:flex z-50 shrink-0 h-full"
          style={{
            background: "var(--sidebar, #0d1117)",
            borderRight: "1px solid var(--sidebar-border, #1d2228)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 h-14 border-b border-[#1d2228]">
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-xs font-black tracking-widest"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              LS
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-foreground/90">
              Dev Tools
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-col flex-1 px-3 py-4 gap-0.5 overflow-y-auto">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 pb-2">
              Navigation
            </p>

            <Link
              href="/"
              className="flex items-center gap-3 px-2.5 py-2 rounded text-sm font-semibold text-foreground bg-white/5 border border-white/8 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-primary shrink-0" />
              Dashboard
            </Link>

            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 pt-5 pb-2">
              Modules
            </p>

            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-2.5 py-2 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-3 pb-4 border-t border-[#1d2228] pt-3 flex flex-col gap-0.5">
            <a
              href="#"
              className="flex items-center gap-3 px-2.5 py-2 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <Settings className="w-4 h-4 shrink-0" />
              Settings
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-2.5 py-2 rounded text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Logout
            </a>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Header */}
          <header className="h-14 shrink-0 border-b border-border bg-card flex items-center justify-between px-5 z-40">
            {/* Left */}
            <div className="flex items-center gap-4">
              <nav className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span className="hover:text-foreground cursor-pointer transition-colors">Admin</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-foreground">Workspace</span>
              </nav>
              <div className="hidden lg:block w-px h-4 bg-border" />
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search modules or files... (Ctrl+K)"
                  className="bg-background border border-border rounded h-8 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/30 placeholder:text-muted-foreground/50 transition-all w-64"
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button className="relative p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
              </button>

              <div className="w-px h-4 bg-border" />

              <button className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-muted transition-colors">
                <div className="w-7 h-7 rounded bg-muted border border-border flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-foreground leading-tight">Admin User</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider leading-tight">
                    Superadmin
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
