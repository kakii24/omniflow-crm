/**
 * app/dashboard/page.tsx
 * ═══════════════════════════════════════════════════════════════
 * OmniFlow CRM — Protected Dashboard (React Server Component)
 *
 * Security:   Supabase SSR session check → redirect to /login if
 *             unauthenticated.
 * Aesthetic:  Matches the premium Apple-style light theme of the
 *             homepage (white cards, subtle gray borders, soft
 *             multi-layer ambient shadows, system blue accents).
 * Layout:     Top nav bar + KPI bento grid + inventory table.
 * ═══════════════════════════════════════════════════════════════
 */

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import InventoryTableClient from "@/app/components/InventoryTableClient";

/* ─────────────────────────────────────────────────
   Types
───────────────────────────────────────────────── */
interface KpiCardProps {
  title: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  subtitle: string;
  accentColor: string;
  gradientId: string;
  svgPath: string;
  svgArea: string;
  icon: React.ReactNode;
  badge?: string;
}

interface InventoryRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  qty: number;
  marketValue: string;
  condition: "Excellent" | "Good" | "Fair" | "Pending";
  lastAssessed: string;
}

/* ─────────────────────────────────────────────────
   Mock data — replace with real Supabase queries
───────────────────────────────────────────────── */
const kpiData: Omit<KpiCardProps, "icon">[] = [
  {
    title:         "Active Smartphone Inventory",
    value:         "3,842",
    delta:         "+127 this week",
    deltaPositive: true,
    subtitle:      "Units across 6 warehouses",
    accentColor:   "#2563EB",
    gradientId:    "kpi-blue",
    badge:         "Smartphones",
    svgPath:       "M0 38 C15 34 28 28 42 20 C56 12 66 8 80 6 C94 4 106 12 120 10",
    svgArea:       "M0 38 C15 34 28 28 42 20 C56 12 66 8 80 6 C94 4 106 12 120 10 L120 48 L0 48 Z",
  },
  {
    title:         "Used PC Hardware Market Value",
    value:         "$284,610",
    delta:         "+$18,240 MTD",
    deltaPositive: true,
    subtitle:      "Laptops, desktops & components",
    accentColor:   "#10B981",
    gradientId:    "kpi-emerald",
    badge:         "PC Hardware",
    svgPath:       "M0 40 C14 36 26 30 40 24 C54 18 64 10 78 8 C92 6 104 14 120 11",
    svgArea:       "M0 40 C14 36 26 30 40 24 C54 18 64 10 78 8 C92 6 104 14 120 11 L120 48 L0 48 Z",
  },
  {
    title:         "Pending Resale Assessments",
    value:         "214",
    delta:         "48 overdue",
    deltaPositive: false,
    subtitle:      "Awaiting grading or pricing",
    accentColor:   "#F59E0B",
    gradientId:    "kpi-amber",
    badge:         "Assessments",
    svgPath:       "M0 32 C12 36 24 40 38 34 C52 28 62 14 76 10 C90 6 102 16 120 13",
    svgArea:       "M0 32 C12 36 24 40 38 34 C52 28 62 14 76 10 C90 6 102 16 120 13 L120 48 L0 48 Z",
  },
];

const inventoryRows: InventoryRow[] = [
  { id: "INV-0041", sku: "SPH-APP-15PM-512",  name: "iPhone 15 Pro Max 512GB",         category: "Smartphone",  qty: 82,  marketValue: "$72,140",  condition: "Excellent", lastAssessed: "Jun 29, 2026" },
  { id: "INV-0038", sku: "SPH-SAM-S24U-256",  name: "Samsung Galaxy S24 Ultra 256GB",  category: "Smartphone",  qty: 54,  marketValue: "$35,370",  condition: "Good",      lastAssessed: "Jun 28, 2026" },
  { id: "INV-0035", sku: "LAP-DEL-XPS15-i9",  name: 'Dell XPS 15 (i9, 32GB RAM)',      category: "Laptop",      qty: 21,  marketValue: "$36,960",  condition: "Excellent", lastAssessed: "Jun 27, 2026" },
  { id: "INV-0032", sku: "LAP-APL-MBP14-M3",  name: "MacBook Pro 14\" M3 Pro",          category: "Laptop",      qty: 17,  marketValue: "$34,000",  condition: "Excellent", lastAssessed: "Jun 26, 2026" },
  { id: "INV-0029", sku: "DSK-APL-MAC-M2",    name: "Apple Mac mini M2",               category: "Desktop",     qty: 33,  marketValue: "$23,100",  condition: "Good",      lastAssessed: "Jun 25, 2026" },
  { id: "INV-0027", sku: "GPU-NVI-RTX4080",   name: "NVIDIA RTX 4080 16GB",            category: "Component",   qty: 9,   marketValue: "$9,360",   condition: "Good",      lastAssessed: "Jun 25, 2026" },
  { id: "INV-0024", sku: "SPH-APP-14-128",    name: "iPhone 14 128GB",                 category: "Smartphone",  qty: 148, marketValue: "$55,500",  condition: "Fair",      lastAssessed: "Jun 24, 2026" },
  { id: "INV-0021", sku: "TAB-SAM-TAB9P",     name: "Samsung Galaxy Tab S9+",          category: "Tablet",      qty: 28,  marketValue: "$18,760",  condition: "Good",      lastAssessed: "Pending" },
  { id: "INV-0019", sku: "LAP-LEN-X1C11",     name: "Lenovo ThinkPad X1 Carbon G11",   category: "Laptop",      qty: 14,  marketValue: "$14,980",  condition: "Pending",   lastAssessed: "Pending" },
  { id: "INV-0016", sku: "SPH-GOO-PIX8P",     name: "Google Pixel 8 Pro 256GB",        category: "Smartphone",  qty: 61,  marketValue: "$30,500",  condition: "Pending",   lastAssessed: "Pending" },
];

/* ─────────────────────────────────────────────────
   Condition badge
───────────────────────────────────────────────── */
function ConditionBadge({ condition }: { condition: InventoryRow["condition"] }) {
  const map: Record<InventoryRow["condition"], { bg: string; color: string }> = {
    Excellent: { bg: "rgba(16,185,129,0.1)",   color: "#059669" },
    Good:      { bg: "rgba(37,99,235,0.08)",   color: "#2563EB" },
    Fair:      { bg: "rgba(245,158,11,0.1)",   color: "#D97706" },
    Pending:   { bg: "rgba(156,163,175,0.15)", color: "#6B7280" },
  };
  const s = map[condition];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {condition}
    </span>
  );
}

/* ─────────────────────────────────────────────────
   Inline sparkline
───────────────────────────────────────────────── */
function KpiSparkline({
  color,
  gradientId,
  path,
  area,
}: {
  color: string;
  gradientId: string;
  path: string;
  area: string;
}) {
  return (
    <svg viewBox="0 0 120 48" fill="none" className="w-full h-12" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={path}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className="chart-line"
      />
      {/* Endpoint glow */}
      <circle cx="120" cy="10" r="3"   fill={color} />
      <circle cx="120" cy="10" r="6.5" fill={color} fillOpacity="0.15" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────
   KPI Bento Card
───────────────────────────────────────────────── */
function KpiCard({
  title,
  value,
  delta,
  deltaPositive,
  subtitle,
  accentColor,
  gradientId,
  svgPath,
  svgArea,
  icon,
  badge,
}: KpiCardProps) {
  return (
    <article
      className="relative flex flex-col rounded-2xl bg-white overflow-hidden bento-card"
      style={{
        border:     "1px solid rgba(0,0,0,0.07)",
        boxShadow:  "0 1px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
        padding:    "28px 28px 24px",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-5">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: `${accentColor}14`,
            color:       accentColor,
          }}
        >
          {icon}
        </div>

        {/* Badge */}
        {badge && (
          <span
            className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
            style={{
              background: `${accentColor}10`,
              color:       accentColor,
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <span
          className="text-3xl font-bold tracking-tight"
          style={{ color: "#111827", letterSpacing: "-0.028em" }}
        >
          {value}
        </span>
      </div>

      {/* Title */}
      <p
        className="text-sm font-medium leading-snug mb-1"
        style={{ color: "#374151" }}
      >
        {title}
      </p>

      {/* Subtitle */}
      <p className="text-xs mb-4" style={{ color: "#9CA3AF" }}>
        {subtitle}
      </p>

      {/* Sparkline */}
      <div className="mb-3">
        <KpiSparkline
          color={accentColor}
          gradientId={gradientId}
          path={svgPath}
          area={svgArea}
        />
      </div>

      {/* Delta */}
      <div className="flex items-center gap-1.5">
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold"
          style={{ color: deltaPositive ? "#059669" : "#D97706" }}
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            {deltaPositive ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            )}
          </svg>
          {delta}
        </span>
      </div>

      {/* Accent left border stripe */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full"
        style={{ background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}44 100%)` }}
      />
    </article>
  );
}

/* ─────────────────────────────────────────────────
   Icons
───────────────────────────────────────────────── */
function SmartphoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    </svg>
  );
}
function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────
   Dashboard Top Navigation
───────────────────────────────────────────────── */
function DashboardNav({ email }: { email: string }) {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-10"
      style={{
        height:      "56px",
        background:  "rgba(255,255,255,0.88)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      {/* Left: logo + breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #2563EB, #4F46E5)" }}
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
            <path
              d="M4 14 L8 8 L12 11 L16 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="4"  cy="14" r="1.5" fill="white" />
            <circle cx="16" cy="5"  r="1.5" fill="white" />
          </svg>
        </div>

        {/* Wordmark */}
        <span
          className="text-sm font-semibold hidden sm:block"
          style={{ color: "#111827", letterSpacing: "-0.01em" }}
        >
          OmniFlow
        </span>

        {/* Breadcrumb divider */}
        <span className="hidden sm:block text-sm" style={{ color: "#D1D5DB" }}>/</span>

        {/* Current page */}
        <span
          className="hidden sm:block text-sm font-medium"
          style={{ color: "#6B7280" }}
        >
          Dashboard
        </span>
      </div>

      {/* Center: live indicator */}
      <div
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{ background: "rgba(16,185,129,0.08)", color: "#059669" }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
          style={{ background: "#10B981" }}
        />
        All systems operational
      </div>

      {/* Right: user chip + actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className="relative w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ color: "#6B7280" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Unread dot */}
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full border-2 border-white"
            style={{ background: "#EF4444" }}
          />
        </button>

        {/* User chip */}
        <div
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full cursor-default"
          style={{
            background: "#F9FAFB",
            border:     "1px solid rgba(0,0,0,0.07)",
          }}
        >
          {/* Avatar */}
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
            style={{
              background:  "linear-gradient(135deg, #2563EB, #4F46E5)",
              fontSize:    "10px",
            }}
          >
            {email.charAt(0).toUpperCase()}
          </div>
          {/* Email */}
          <span
            className="hidden sm:block text-xs font-medium max-w-[160px] truncate"
            style={{ color: "#374151" }}
          >
            {email}
          </span>
          <ChevronIcon />
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────
   Sidebar
───────────────────────────────────────────────── */
const sideNavItems = [
  {
    label: "Dashboard",
    active: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4.5 h-4.5 w-[18px] h-[18px]">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Inventory",
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
        <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Assessments",
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Financials",
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
        <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Tenants",
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Reports",
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
        <path d="M9 17v-2m3 2v-4m3 4v-6M3 3h18v18H3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Settings",
    active: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" />
      </svg>
    ),
  },
];

function Sidebar() {
  return (
    <aside
      className="hidden lg:flex flex-col w-56 shrink-0"
      style={{
        background:  "#FFFFFF",
        borderRight: "1px solid rgba(0,0,0,0.07)",
        paddingTop:  "24px",
      }}
    >
      {/* Nav items */}
      <nav aria-label="Dashboard navigation" className="flex-1 px-3 space-y-0.5">
        {sideNavItems.map((item) => (
          <a
            key={item.label}
            href="#"
            aria-current={item.active ? "page" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 select-none"
            style={{
              background: item.active ? "rgba(37,99,235,0.07)" : "transparent",
              color:      item.active ? "#2563EB"              : "#6B7280",
            }}
          >
            <span style={{ color: item.active ? "#2563EB" : "#9CA3AF" }}>
              {item.icon}
            </span>
            {item.label}
            {item.label === "Assessments" && (
              <span
                className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(245,158,11,0.12)", color: "#D97706" }}
              >
                48
              </span>
            )}
          </a>
        ))}
      </nav>

      {/* Bottom: logout */}
      <div className="px-3 pb-5 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
            style={{ color: "#6B7280" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px] shrink-0" aria-hidden="true">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────
   Summary stat bar (above KPI grid)
───────────────────────────────────────────────── */
function SummaryBar() {
  const stats = [
    { label: "Total SKUs",       value: "4,086",   color: "#2563EB" },
    { label: "Total Market Value", value: "$518,720", color: "#10B981" },
    { label: "Sold This Month",  value: "312",     color: "#8B5CF6" },
    { label: "Return Rate",      value: "2.4%",    color: "#F59E0B" },
  ];
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl"
      style={{ background: "rgba(0,0,0,0.06)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col gap-1 px-6 py-4 bg-white"
        >
          <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>{s.label}</span>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: s.color, letterSpacing: "-0.02em" }}
          >
            {s.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Inventory Table
───────────────────────────────────────────────── */
function InventoryTable() {
  const columns = ["ID", "SKU", "Name", "Category", "Qty", "Market Value", "Condition", "Last Assessed"];

  return (
    <section
      className="rounded-2xl bg-white overflow-hidden"
      style={{
        border:    "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
      aria-label="Inventory table"
    >
      {/* Table header bar */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div>
          <h2
            className="text-base font-semibold"
            style={{ color: "#111827", letterSpacing: "-0.012em" }}
          >
            Inventory Register
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
            {inventoryRows.length} items · Sorted by latest assessed
          </p>
        </div>

        {/* Table controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
            style={{
              background: "#F9FAFB",
              border:     "1px solid rgba(0,0,0,0.07)",
              color:      "#9CA3AF",
            }}
          >
            <SearchIcon />
            <span className="text-xs">Search inventory…</span>
          </div>

          {/* Filter */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: "#F9FAFB",
              border:     "1px solid rgba(0,0,0,0.07)",
              color:      "#6B7280",
            }}
            aria-label="Filter inventory"
          >
            <FilterIcon />
            <span className="hidden sm:inline">Filter</span>
          </button>

          {/* Export */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: "#F9FAFB",
              border:     "1px solid rgba(0,0,0,0.07)",
              color:      "#6B7280",
            }}
            aria-label="Export inventory"
          >
            <ExportIcon />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Add item */}
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium text-white"
            style={{ background: "linear-gradient(135deg, #2563EB, #4F46E5)" }}
            aria-label="Add inventory item"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Add Item</span>
          </button>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse" role="table">
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              {columns.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold tracking-wider uppercase select-none whitespace-nowrap"
                  style={{ color: "#9CA3AF" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventoryRows.map((row, i) => (
              <tr
                key={row.id}
                className="group transition-colors duration-100"
                style={{
                  background:   i % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                {/* ID */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span
                    className="text-xs font-mono font-medium px-2 py-0.5 rounded"
                    style={{ background: "rgba(37,99,235,0.06)", color: "#2563EB" }}
                  >
                    {row.id}
                  </span>
                </td>
                {/* SKU */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="text-xs font-mono" style={{ color: "#6B7280" }}>
                    {row.sku}
                  </span>
                </td>
                {/* Name */}
                <td className="px-5 py-3.5">
                  <span className="font-medium text-sm" style={{ color: "#111827" }}>
                    {row.name}
                  </span>
                </td>
                {/* Category */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="text-xs" style={{ color: "#6B7280" }}>{row.category}</span>
                </td>
                {/* Qty */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="font-semibold text-sm" style={{ color: "#374151" }}>
                    {row.qty.toLocaleString()}
                  </span>
                </td>
                {/* Market value */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="font-semibold text-sm" style={{ color: "#059669" }}>
                    {row.marketValue}
                  </span>
                </td>
                {/* Condition */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <ConditionBadge condition={row.condition} />
                </td>
                {/* Last assessed */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span
                    className="text-xs"
                    style={{
                      color: row.lastAssessed === "Pending" ? "#D97706" : "#6B7280",
                      fontStyle: row.lastAssessed === "Pending" ? "italic" : "normal",
                    }}
                  >
                    {row.lastAssessed}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div
        className="flex items-center justify-between px-6 py-3.5"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        <span className="text-xs" style={{ color: "#9CA3AF" }}>
          Showing 1–{inventoryRows.length} of 214 items
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, "…", 22].map((p, i) => (
            <button
              key={i}
              className="w-7 h-7 rounded-lg text-xs font-medium flex items-center justify-center transition-colors"
              style={{
                background: p === 1 ? "rgba(37,99,235,0.08)" : "transparent",
                color:      p === 1 ? "#2563EB"              : "#6B7280",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────
   Activity Feed widget
───────────────────────────────────────────────── */
function ActivityFeed() {
  const events = [
    { time: "2 min ago",  text: "82 iPhone 15 Pro Max units checked in",    dot: "#2563EB" },
    { time: "14 min ago", text: "Assessment completed: Dell XPS 15 batch",   dot: "#10B981" },
    { time: "1 hr ago",   text: "48 SKUs flagged as pending review",         dot: "#F59E0B" },
    { time: "3 hr ago",   text: "Bulk export triggered by admin@acme.io",    dot: "#8B5CF6" },
    { time: "Yesterday",  text: "Market value recalculated for PC Hardware",  dot: "#6B7280" },
  ];
  return (
    <div
      className="rounded-2xl bg-white p-5 flex flex-col"
      style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>
          Recent Activity
        </h3>
        <span className="text-xs" style={{ color: "#9CA3AF" }}>Live</span>
      </div>
      <ol className="space-y-3">
        {events.map((e, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="mt-1.5 w-2 h-2 rounded-full shrink-0"
              style={{ background: e.dot }}
            />
            <div>
              <p className="text-xs" style={{ color: "#374151" }}>{e.text}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>{e.time}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Assessment Queue widget
───────────────────────────────────────────────── */
function AssessmentQueue() {
  const queue = [
    { name: "Google Pixel 8 Pro (batch)",  count: 61, urgency: "High",   color: "#EF4444" },
    { name: "Samsung Galaxy Tab S9+",      count: 28, urgency: "Medium", color: "#F59E0B" },
    { name: "Lenovo ThinkPad X1 G11",      count: 14, urgency: "Medium", color: "#F59E0B" },
    { name: "iPhone 13 mini (mixed)",      count: 9,  urgency: "Low",    color: "#10B981" },
  ];
  return (
    <div
      className="rounded-2xl bg-white p-5 flex flex-col"
      style={{ border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>
          Assessment Queue
        </h3>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: "rgba(245,158,11,0.1)", color: "#D97706" }}
        >
          48 pending
        </span>
      </div>
      <ul className="space-y-2.5">
        {queue.map((item) => (
          <li
            key={item.name}
            className="flex items-center gap-3 p-2.5 rounded-xl"
            style={{ background: "#F9FAFB" }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: item.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "#374151" }}>
                {item.name}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: `${item.color}14`,
                  color:       item.color,
                }}
              >
                {item.urgency}
              </span>
              <span className="text-xs font-semibold" style={{ color: "#6B7280" }}>
                {item.count}u
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE — Server Component with Auth Guard
═══════════════════════════════════════════════ */
export default async function DashboardPage() {
  /* ── 1. Fetch session via Supabase SSR client ── */
  const supabase = await createSupabaseServerClient();
  const { data: metrics } = await supabase
    .from("operations_metrics")
    .select("*")
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /* ── 2. Guard: redirect unauthenticated visitors ── */
  if (!user) {
    redirect("/login");
  }

  const userEmail = user.email ?? "user@omniflow.io";

  /* ── 3. Render KPI card data with icons ── */
  const kpiCards: KpiCardProps[] = [
    { ...kpiData[0], icon: <SmartphoneIcon /> },
    { ...kpiData[1], icon: <MonitorIcon />    },
    { ...kpiData[2], icon: <ClipboardIcon />  },
  ];

  /* ── 4. Render dashboard ── */
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F4F7FA" }}>
      {/* Top navigation */}
      <DashboardNav email={userEmail} />

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main scroll area */}
        <main
          id="dashboard-main"
          className="flex-1 overflow-y-auto"
          style={{ padding: "28px 28px 48px" }}
        >
          {/* ── Page header ── */}
          <div className="flex items-start justify-between mb-7">
            <div>
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: "#111827", letterSpacing: "-0.022em" }}
              >
                Operations Overview
              </h1>
              <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                Welcome back,{" "}
                <span style={{ color: "#374151", fontWeight: 500 }}>
                  {userEmail}
                </span>{" "}
                — here&#39;s your live inventory snapshot.
              </p>
            </div>

            {/* Date chip */}
            <div
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium shrink-0"
              style={{
                background: "white",
                border:     "1px solid rgba(0,0,0,0.07)",
                color:      "#6B7280",
                boxShadow:  "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
              </svg>
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>

          {/* ── Summary stats bar ── */}
          <div className="mb-6">
            <SummaryBar />
          </div>

          {/* ── KPI grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {kpiCards.map((card) => (
              <KpiCard key={card.title} {...card} />
            ))}
          </div>

          {/* ── Lower grid: table (left 2/3) + widgets (right 1/3) ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Inventory table spans 2 columns */}
            <div className="xl:col-span-2">
              <InventoryTableClient rows={metrics || []} />
            </div>

            {/* Right column: activity + queue */}
            <div className="flex flex-col gap-4">
              <ActivityFeed />
              <AssessmentQueue />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
