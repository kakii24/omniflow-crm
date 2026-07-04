"use client";
// FeaturesSection.tsx — Bento Box grid with Framer Motion lift animations

import { motion, type Variants } from "framer-motion";

/* ── Shared animation variants ── */
const cardVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow:
      "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
  },
  hover: {
    y: -8,
    scale: 1.010,
    /* Multi-layer ambient occlusion shadow */
    boxShadow:
      "0 10px 20px -5px rgba(0,0,0,0.06), 0 30px 60px -15px rgba(0,0,0,0.12), 0 60px 100px -25px rgba(37,99,235,0.08)",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
};

const iconVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.12,
    rotate: -4,
    transition: { type: "spring" as const, stiffness: 400, damping: 18 },
  },
};

/* ── Inline SVG chart spark ── */
function SparkChart({ color = "#0071E3" }: { color?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      className="w-full"
      aria-hidden="true"
    >
      {/* Vibrant area fill */}
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path
        d="M0 36 C15 32 25 28 35 22 C45 16 55 8 70 6 C85 4 95 14 120 10 L120 40 L0 40 Z"
        fill={`url(#grad-${color.replace("#", "")})`}
      />
      {/* Line */}
      <path
        d="M0 36 C15 32 25 28 35 22 C45 16 55 8 70 6 C85 4 95 14 120 10"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        className="chart-line"
      />
      {/* Endpoint dot */}
      <circle cx="120" cy="10" r="3"   fill={color} />
      <circle cx="120" cy="10" r="6"   fill={color} fillOpacity="0.18" />
    </svg>
  );
}

/* ── Shield icon ── */
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );
}

/* ── Bento Card ── */
interface BentoCardProps {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
  bullets: string[];
  sparkColor?: string;
  stat?: { value: string; label: string; delta?: string };
  className?: string;
}

function BentoCard({
  id,
  icon,
  iconBg,
  iconColor,
  eyebrow,
  title,
  description,
  badge,
  badgeBg,
  badgeColor,
  bullets,
  sparkColor = "#0071E3",
  stat,
  className = "",
}: BentoCardProps) {
  return (
    <motion.article
      id={id}
      className={`relative flex flex-col p-8 rounded-2xl bg-white overflow-hidden ${className}`}
      style={{ border: "1px solid rgba(0,0,0,0.08)" }}
      initial="rest"
      whileHover="hover"
      variants={cardVariants}
      aria-label={title}
    >
      {/* ── Top row: icon + badge ── */}
      <div className="flex items-start justify-between mb-6">
        <motion.div
          variants={iconVariants}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </motion.div>

        {badge && (
          <span
            className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
            style={{ background: badgeBg ?? "#F5F5F7", color: badgeColor ?? "#424245" }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* ── Text ── */}
      <p
        className="text-[11px] font-medium tracking-[0.16em] uppercase mb-2"
        style={{ color: "#6E6E73" }}
      >
        {eyebrow}
      </p>
      <h3
        className="text-lg font-semibold leading-snug mb-3"
        style={{ color: "#1D1D1F", letterSpacing: "-0.012em" }}
      >
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed mb-6"
        style={{ color: "#6E6E73" }}
      >
        {description}
      </p>

      {/* ── Spark chart ── */}
      <div className="mb-6 h-10">
        <SparkChart color={sparkColor} />
      </div>

      {/* ── Stat pill ── */}
      {stat && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
          style={{ background: "#F5F5F7" }}
        >
          <div>
            <div
              className="text-xl font-bold tracking-tight"
              style={{ color: "#1D1D1F", letterSpacing: "-0.02em" }}
            >
              {stat.value}
            </div>
            <div className="text-[11px]" style={{ color: "#6E6E73" }}>
              {stat.label}
            </div>
          </div>
          {stat.delta && (
            <span
              className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: "#1A8A3C",
                background: "rgba(26,138,60,0.1)",
              }}
            >
              {stat.delta}
            </span>
          )}
        </div>
      )}

      {/* ── Divider ── */}
      <div
        className="mb-5"
        style={{ height: "1px", background: "rgba(0,0,0,0.06)" }}
      />

      {/* ── Bullets ── */}
      <ul className="space-y-2.5 flex-1">
        {bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-2.5 text-sm"
            style={{ color: "#424245" }}
          >
            <svg
              className="w-4 h-4 mt-0.5 shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="7" fill={sparkColor} opacity="0.1" />
              <path
                d="M5 8l2 2 4-4"
                stroke={sparkColor}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {b}
          </li>
        ))}
      </ul>

      {/* ── Learn more ── */}
      <motion.a
        href={`#${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium mt-7"
        style={{ color: sparkColor }}
        whileHover={{ x: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        aria-label={`Learn more about ${title}`}
      >
        Learn more
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </motion.a>
    </motion.article>
  );
}

const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemFadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] },
  },
};

export default function FeaturesSection() {
  return (
    <section
      id="features"
      aria-label="OmniFlow Platform Features"
      className="py-28 px-6 md:px-12 lg:px-20"
      style={{
        /* Matches hero ice-blue/slate gradient palette */
        background: `
          radial-gradient(ellipse 80% 60% at 100% 0%, rgba(224,231,255,0.45) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 0% 100%, rgba(219,234,254,0.35) 0%, transparent 60%),
          #EEF2F7
        `,
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Section header ── */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-5"
            style={{
              background: "rgba(0,113,227,0.08)",
              color: "#0071E3",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
              style={{ background: "#0071E3" }}
            />
            Core capabilities
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-5"
            style={{ color: "#111827", letterSpacing: "-0.027em" }}
          >
            Everything your enterprise{" "}
            <br className="hidden md:block" />
            <span className="gradient-text-crm">operations demand.</span>
          </h2>

          <p
            className="text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: "#4B5563" }}
          >
            Three core pillars — security, financial clarity, and supply-chain precision —
            engineered to ISO 27001 and SOC 2 Type II standards.
          </p>
        </motion.div>

        {/* ── Bento Grid ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Card 1 — Security */}
          <motion.div variants={itemFadeUp} className="lg:row-span-1">
            <BentoCard
              id="row-level-isolation"
              icon={<ShieldIcon />}
              iconBg="rgba(0,113,227,0.1)"
              iconColor="#0071E3"
              eyebrow="Security Architecture"
              title="Row-Level Isolation Security"
              badge="Zero-Trust"
              badgeBg="rgba(0,113,227,0.08)"
              badgeColor="#0071E3"
              description="Cryptographically enforced tenant boundary separation at the database row level. No cross-tenant data leakage — by design, not policy."
              bullets={[
                "PostgreSQL RLS policies per tenant",
                "Encrypted partition keys at rest",
                "Audit logs on every data access",
                "GDPR & HIPAA compliant by default",
              ]}
              sparkColor="#0071E3"
              stat={{ value: "100%", label: "Tenant isolation rate", delta: "SOC 2 ✓" }}
            />
          </motion.div>

          {/* Card 2 — Financials */}
          <motion.div variants={itemFadeUp}>
            <BentoCard
              id="financial-dashboards"
              icon={<ChartIcon />}
              iconBg="rgba(52,199,89,0.1)"
              iconColor="#1A8A3C"
              eyebrow="Financial Intelligence"
              title="Financial Dashboards"
              badge="Real-Time"
              badgeBg="rgba(52,199,89,0.1)"
              badgeColor="#1A8A3C"
              description="Live P&L, cash flow forecasting, and multi-currency ledger reconciliation from every connected source into a single pane of glass."
              bullets={[
                "Sub-second financial KPI refresh",
                "Multi-entity consolidation engine",
                "Automated variance alerts",
                "Export to XBRL, PDF, and Excel",
              ]}
              sparkColor="#34C759"
              stat={{ value: "$4.2M", label: "Revenue MTD", delta: "+12.4%" }}
            />
          </motion.div>

          {/* Card 3 — Inventory */}
          <motion.div variants={itemFadeUp}>
            <BentoCard
              id="inventory-management"
              icon={<BoxIcon />}
              iconBg="rgba(255,149,0,0.1)"
              iconColor="#C8680A"
              eyebrow="Supply Chain Control"
              title="Inventory Management"
              badge="AI-Assisted"
              badgeBg="rgba(255,149,0,0.1)"
              badgeColor="#C8680A"
              description="Predictive reorder signals, SKU-level traceability, and warehouse optimisation powered by demand-forecasting ML models."
              bullets={[
                "Real-time stock-level webhooks",
                "Barcode & RFID scanner integration",
                "Demand forecasting ±4% MAPE",
                "Multi-warehouse routing engine",
              ]}
              sparkColor="#FF9500"
              stat={{ value: "1,847", label: "Active SKUs tracked", delta: "+3.1%" }}
            />
          </motion.div>
        </motion.div>

        {/* ── Enterprise CTA strip ── */}
        <motion.div
          className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-6 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(37,99,235,0.1)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
            backdropFilter: "blur(12px)",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "#111827" }}
            >
              Need a tailored enterprise deployment?
            </p>
            <p className="text-sm" style={{ color: "#4B5563" }}>
              Dedicated SLAs, private cloud hosting, and custom integrations.
            </p>
          </div>
          <motion.a
            href="#"
            id="features-contact-enterprise"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)" }}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 4px 20px rgba(0,113,227,0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 20 }}
          >
            Contact Enterprise Sales
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
