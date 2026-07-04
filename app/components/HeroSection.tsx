"use client";
/**
 * HeroSection.tsx
 * ─────────────────────────────────────────────────────
 * Upgrades applied:
 *  1. Layered background: ice-blue/slate radial gradient + dot-grid texture
 *  2. Blurred colorful aura BEHIND the device (blue→indigo→transparent)
 *  3. Dark aluminium device chassis with multi-layer ambient-occlusion shadow
 *  4. Gradient text on "& CRM" (blue → indigo → sky)
 *  5. Vibrant chart colors per KPI tile (emerald, amber, blue)
 *  6. 3D cursor-tracking tilt on device frame (perspective: 1000px)
 *  7. Scroll-into-view stat counter pop animation
 *  8. Framer Motion stagger entrance on all copy elements
 */

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

/* ═══════════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════════ */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] },
  }),
};

const frameFade = {
  hidden:  { opacity: 0, y: 52, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.9, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] },
  },
};

/* ═══════════════════════════════════════════════
   KPI SPARKLINE — vibrant per-metric colors
═══════════════════════════════════════════════ */
interface SparklineProps {
  color: string;
  gradientId: string;
  path: string;
  areaPath: string;
}

function MiniSparkline({ color, gradientId, path, areaPath }: SparklineProps) {
  return (
    <svg viewBox="0 0 80 28" fill="none" className="w-full h-7" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={path}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        className="chart-line"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   INLINE DASHBOARD
═══════════════════════════════════════════════ */
function InlineDashboard() {
  const sideItems = ["Dashboard", "Tenants", "Financials", "Inventory", "Settings"];

  /* Distinct vibrant colors + unique sparkline paths per KPI */
  const kpis = [
    {
      label:      "Revenue MTD",
      value:      "$4.2M",
      delta:      "+12.4%",
      color:      "#2563EB",          // vivid blue
      gradientId: "spark-blue",
      path:       "M0 22 C10 19 18 16 28 12 C38 8 46 5 58 4 C68 3 74 8 80 6",
      areaPath:   "M0 22 C10 19 18 16 28 12 C38 8 46 5 58 4 C68 3 74 8 80 6 L80 28 L0 28 Z",
    },
    {
      label:      "Active Tenants",
      value:      "1,847",
      delta:      "+3.1%",
      color:      "#10B981",          // vivid emerald green
      gradientId: "spark-emerald",
      path:       "M0 24 C8 21 16 18 26 15 C36 12 44 9 56 7 C66 5 72 9 80 8",
      areaPath:   "M0 24 C8 21 16 18 26 15 C36 12 44 9 56 7 C66 5 72 9 80 8 L80 28 L0 28 Z",
    },
    {
      label:      "Inventory SKUs",
      value:      "14,302",
      delta:      "+0.8%",
      color:      "#F59E0B",          // vivid amber
      gradientId: "spark-amber",
      path:       "M0 20 C10 17 18 20 28 16 C38 12 46 8 60 6 C70 4 74 10 80 9",
      areaPath:   "M0 20 C10 17 18 20 28 16 C38 12 46 8 60 6 C70 4 74 10 80 9 L80 28 L0 28 Z",
    },
  ];

  return (
    <div className="flex h-full" style={{ background: "#F8FAFC" }}>
      {/* ── Sidebar ── */}
      <aside
        className="hidden md:flex flex-col w-44 shrink-0 py-4 px-3 gap-1"
        style={{
          background:  "white",
          borderRight: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center gap-2 px-2 py-2 mb-3">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2563EB, #4F46E5)" }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M2 11 L5 7 L9 9 L14 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xs font-semibold" style={{ color: "#111827" }}>OmniFlow</span>
        </div>

        {sideItems.map((item, i) => (
          <div
            key={item}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium cursor-default select-none"
            style={{
              background: i === 0 ? "rgba(37,99,235,0.08)" : "transparent",
              color:      i === 0 ? "#2563EB"              : "#6B7280",
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {i === 0 && <path d="M2 12 L5 8 L8 10 L14 4" strokeLinecap="round" strokeLinejoin="round" />}
              {i === 1 && <><circle cx="8" cy="6" r="3" /><path d="M1 14c0-3.3 3-6 7-6s7 2.7 7 6" strokeLinecap="round" /></>}
              {i === 2 && <><path d="M2 10h3M7 6h3M12 8h2" strokeLinecap="round" /><path d="M2 4L14 4M2 12L14 12" strokeLinecap="round" /></>}
              {i === 3 && <path d="M3 4h10v8H3zM6 4V2M10 4V2M3 8h10" strokeLinecap="round" strokeLinejoin="round" />}
              {i === 4 && <><circle cx="8" cy="8" r="2" /><path d="M8 2v1M8 13v1M2 8h1M13 8h1" strokeLinecap="round" /></>}
            </svg>
            {item}
          </div>
        ))}
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden p-4 gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold" style={{ color: "#111827" }}>Dashboard</h2>
            <p className="text-[10px]" style={{ color: "#9CA3AF" }}>Last updated: just now</p>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium"
            style={{ background: "rgba(37,99,235,0.08)", color: "#2563EB" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: "#2563EB" }} />
            Live
          </div>
        </div>

        {/* KPI tiles — vibrant sparklines */}
        <div className="grid grid-cols-3 gap-2">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="flex flex-col p-3 rounded-xl"
              style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <span className="text-[9px] font-medium mb-1 uppercase tracking-wider" style={{ color: "#9CA3AF" }}>
                {kpi.label}
              </span>
              <span className="text-sm font-bold leading-none mb-1.5" style={{ color: "#111827", letterSpacing: "-0.02em" }}>
                {kpi.value}
              </span>
              <MiniSparkline
                color={kpi.color}
                gradientId={kpi.gradientId}
                path={kpi.path}
                areaPath={kpi.areaPath}
              />
              <span className="text-[9px] font-semibold mt-1" style={{ color: kpi.color }}>
                {kpi.delta}
              </span>
            </div>
          ))}
        </div>

        {/* Revenue trend chart */}
        <div
          className="flex-1 rounded-xl p-3 flex flex-col"
          style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold" style={{ color: "#111827" }}>Revenue Trend</span>
            <div className="flex items-center gap-2">
              {["1M","3M","6M","YTD"].map((t, i) => (
                <span
                  key={t}
                  className="text-[9px] font-medium px-2 py-0.5 rounded-full cursor-default"
                  style={{
                    background: i === 2 ? "rgba(37,99,235,0.1)" : "transparent",
                    color:      i === 2 ? "#2563EB"             : "#9CA3AF",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <svg viewBox="0 0 400 90" fill="none" className="w-full h-full" aria-hidden="true">
              <defs>
                <linearGradient id="rev-main" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#2563EB" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0"    />
                </linearGradient>
              </defs>
              {/* Horizontal grid */}
              {[18, 36, 54, 72].map((y) => (
                <line key={y} x1="0" y1={y} x2="400" y2={y}
                  stroke="rgba(0,0,0,0.05)" strokeWidth="0.75" strokeDasharray="4 4" />
              ))}
              {/* Area */}
              <path
                d="M0 82 C30 74 55 66 80 52 C105 38 130 22 165 16 C200 10 230 14 260 24 C290 34 318 44 338 32 C358 20 380 10 400 8 L400 90 L0 90 Z"
                fill="url(#rev-main)"
              />
              {/* Line */}
              <path
                d="M0 82 C30 74 55 66 80 52 C105 38 130 22 165 16 C200 10 230 14 260 24 C290 34 318 44 338 32 C358 20 380 10 400 8"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Endpoint glow */}
              <circle cx="400" cy="8" r="3.5" fill="#2563EB" />
              <circle cx="400" cy="8" r="7"   fill="#2563EB" fillOpacity="0.18" />
              {/* X-axis labels */}
              {["Jan","Feb","Mar","Apr","May","Jun"].map((m, i) => (
                <text key={m} x={i * 80} y="88" fontSize="6.5" fill="rgba(0,0,0,0.25)" fontFamily="system-ui">{m}</text>
              ))}
            </svg>
          </div>
        </div>

        {/* Tenant table */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
          <div
            className="grid grid-cols-4 px-3 py-1.5 text-[9px] font-semibold tracking-wider uppercase"
            style={{ background: "#F1F5F9", color: "#9CA3AF", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            <span>Tenant</span><span>Revenue</span><span>Status</span><span>Growth</span>
          </div>
          {[
            { tenant: "Acme Corp",   revenue: "$842K", status: "Active", growth: "+8.2%" },
            { tenant: "GlobalTech",  revenue: "$634K", status: "Active", growth: "+5.1%" },
            { tenant: "NovaSystems", revenue: "$511K", status: "Trial",  growth: "+14.3%" },
          ].map((row, i) => (
            <div
              key={row.tenant}
              className="grid grid-cols-4 px-3 py-1.5 text-[9px] items-center"
              style={{
                background:   i % 2 === 0 ? "white" : "#FAFBFC",
                borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.04)" : "none",
                color: "#374151",
              }}
            >
              <span className="font-medium" style={{ color: "#111827" }}>{row.tenant}</span>
              <span>{row.revenue}</span>
              <span>
                <span
                  className="px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    fontSize:   "8px",
                    background: row.status === "Active" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                    color:      row.status === "Active" ? "#059669"               : "#D97706",
                  }}
                >
                  {row.status}
                </span>
              </span>
              <span className="font-semibold" style={{ color: "#059669" }}>{row.growth}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   3D TILT DEVICE FRAME
═══════════════════════════════════════════════ */
function TiltDeviceFrame() {
  const frameRef = useRef<HTMLDivElement>(null);

  /* Motion values for cursor-driven tilt */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  /* Spring smoothing */
  const springCfg = { stiffness: 140, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [6, -6]),  springCfg);
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-8, 8]),  springCfg);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    rawX.set((e.clientX - cx) / (rect.width  / 2));
    rawY.set((e.clientY - cy) / (rect.height / 2));
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div
      ref={frameRef}
      className="relative w-full"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Blurred aura BEHIND the device ── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          inset:  "-14% -10% -14% -10%",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 80% 70% at 55% 45%, rgba(99,102,241,0.28) 0%, rgba(147,197,253,0.18) 45%, transparent 75%)",
          filter: "blur(48px)",
          opacity: 0.85,
        }}
      />

      {/* ── Dark aluminium device chassis ── */}
      <motion.div
        className="device-chassis relative z-10 w-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Notch bar (camera dot) */}
        <div
          className="flex items-center justify-center py-2 mb-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          {/* Traffic lights */}
          <div className="absolute left-5 flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57", boxShadow: "0 0 4px rgba(255,95,87,0.5)"  }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E", boxShadow: "0 0 4px rgba(255,189,46,0.4)"  }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#28C840", boxShadow: "0 0 4px rgba(40,200,64,0.4)"   }} />
          </div>

          {/* URL bar */}
          <div
            className="flex items-center gap-1.5 px-4 py-1 rounded text-[11px] mx-auto"
            style={{
              background:  "rgba(255,255,255,0.06)",
              border:      "1px solid rgba(255,255,255,0.08)",
              color:       "rgba(255,255,255,0.45)",
              minWidth:    "190px",
              maxWidth:    "280px",
            }}
          >
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>app.omniflow.io</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>/dashboard</span>
          </div>

          {/* Live badge */}
          <div
            className="absolute right-5 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-medium"
            style={{ background: "rgba(37,99,235,0.2)", color: "#93C5FD" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: "#60A5FA" }} />
            Live
          </div>
        </div>

        {/* Screen */}
        <div className="device-screen" style={{ height: "360px" }}>
          <InlineDashboard />
        </div>
      </motion.div>

      {/* Contact shadow beneath chassis */}
      <div
        aria-hidden="true"
        className="absolute left-10 right-10 -bottom-6 h-10 rounded-full pointer-events-none"
        style={{
          background: "rgba(30,40,80,0.14)",
          filter:     "blur(20px)",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SCROLL-TRIGGERED STAT
═══════════════════════════════════════════════ */
function HeroStat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); observer.disconnect(); } },
      { threshold: 0.6 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-col ${triggered ? "stat-pop" : "opacity-0"}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span
        className="text-2xl font-bold tracking-tight"
        style={{ color: "#111827", letterSpacing: "-0.022em" }}
      >
        {value}
      </span>
      <span className="text-xs" style={{ color: "#6B7280" }}>{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════ */
export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="OmniFlow CRM — Enterprise Multi-Tenant Operations"
      className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 px-6 md:px-12 lg:px-20 overflow-hidden bg-dot-grid"
      style={{
        /* Layered background: ice-blue/slate radial gradient over #F4F7FA */
        background: `
          radial-gradient(ellipse 90% 70% at 50% -5%, rgba(219,234,254,0.7) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 90% 80%, rgba(224,231,255,0.4) 0%, transparent 60%),
          #F4F7FA
        `,
      }}
    >
      {/* Dot-grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top-center ambient blue bloom */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-24 h-[520px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 55% at 50% 0%, rgba(37,99,235,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* ── Eyebrow ── */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: "rgba(37,99,235,0.08)",
              color:      "#2563EB",
              border:     "1px solid rgba(37,99,235,0.14)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: "#2563EB" }} />
            Enterprise Platform — v4.2
          </div>
          <span
            className="hidden sm:flex items-center gap-1.5 text-xs"
            style={{ color: "#9CA3AF" }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1z" />
              <path d="M8 5v3l2 2" strokeLinecap="round" />
            </svg>
            SOC 2 Type II Certified
          </span>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            {/* Headline */}
            <motion.h1
              custom={0.1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-6xl font-bold leading-[1.05] mb-6"
              style={{ color: "#111827", letterSpacing: "-0.027em" }}
            >
              Enterprise
              <br />
              Multi-Tenant
              <br />
              Operations{" "}
              {/* ── Gradient text on "& CRM" ── */}
              <span className="gradient-text-crm">&amp; CRM</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              custom={0.22}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-lg leading-relaxed mb-10 max-w-md"
              style={{ color: "#374151" }}
            >
              A unified command centre for row-level tenant isolation, real-time
              financial intelligence, and precision inventory control — engineered
              for organisations that cannot afford downtime.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={0.34}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-3 mb-14"
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 6px 24px rgba(37,99,235,0.32)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 20 }}
              >
                <Link
                  href="#features"
                  id="hero-explore-platform"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium text-white"
                  style={{
                    background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
                  }}
                >
                  Explore Platform
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.03)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 20 }}
                className="rounded-full"
              >
                <Link
                  href="#"
                  id="hero-book-demo"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium"
                  style={{
                    color:      "#374151",
                    background: "rgba(255,255,255,0.7)",
                    border:     "1px solid rgba(0,0,0,0.1)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Book a Demo
                </Link>
              </motion.div>
            </motion.div>

            {/* ── Stat row — scroll-triggered pop ── */}
            <div className="flex flex-wrap gap-8">
              <HeroStat value="99.99%"  label="Uptime SLA"        delay={0}    />
              <div style={{ width: "1px", background: "rgba(0,0,0,0.08)", alignSelf: "stretch" }} />
              <HeroStat value="SOC 2"   label="Type II Certified" delay={0.08} />
              <div style={{ width: "1px", background: "rgba(0,0,0,0.08)", alignSelf: "stretch" }} />
              <HeroStat value="< 40ms"  label="Query P99"         delay={0.16} />
              <div style={{ width: "1px", background: "rgba(0,0,0,0.08)", alignSelf: "stretch" }} />
              <HeroStat value="12K+"    label="Enterprise Users"  delay={0.24} />
            </div>
          </div>

          {/* Right — 3D tilt device */}
          <motion.div
            variants={frameFade}
            initial="hidden"
            animate="visible"
          >
            <TiltDeviceFrame />
          </motion.div>
        </div>

        {/* ── Trusted-by strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mt-20 flex flex-col items-center gap-6"
        >
          <p
            className="text-xs font-medium tracking-widest uppercase"
            style={{ color: "#9CA3AF" }}
          >
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            {["Acme Corp", "GlobalTech", "NovaSystems", "Vertex Inc", "AlphaFin"].map((brand) => (
              <span
                key={brand}
                className="text-sm font-semibold select-none"
                style={{ color: "#D1D5DB", letterSpacing: "-0.01em" }}
              >
                {brand}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
