// Navbar.tsx — RSC with CSS-only micro-animations
import Link from "next/link";

export default function Navbar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-20"
      style={{
        height: "52px",
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* ── Logo ── */}
      <Link
        href="/"
        aria-label="OmniFlow CRM — Back to homepage"
        className="flex items-center gap-2.5 select-none"
      >
        {/* Icon mark */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "#0071E3" }}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path
              d="M4 14 L8 8 L12 11 L16 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="4" cy="14" r="1.5" fill="white" />
            <circle cx="16" cy="5" r="1.5" fill="white" />
          </svg>
        </div>
        <span
          className="text-[15px] font-semibold tracking-tight"
          style={{ color: "#1D1D1F", letterSpacing: "-0.01em" }}
        >
          OmniFlow
        </span>
      </Link>

      {/* ── Center nav links ── */}
      <nav
        aria-label="Primary navigation"
        className="hidden md:flex items-center gap-1"
      >
        {[
          { label: "Platform", href: "#features" },
          { label: "Security", href: "#row-level-isolation" },
          { label: "Financials", href: "#financial-dashboards" },
          { label: "Pricing", href: "#" },
          { label: "Docs", href: "#" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="px-3 py-1.5 rounded-full text-sm font-normal transition-colors duration-150"
            style={{ color: "#424245" }}
          >
            <span className="omniflow-navlink">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* ── Right side ── */}
      <div className="flex items-center gap-3">
        <Link
          href="#"
          className="hidden md:inline-block text-sm font-normal px-3 py-1.5 rounded-full btn-ghost"
          style={{ color: "#424245" }}
        >
          Sign up
        </Link>

        {/* CTA — scaling animation via .nav-cta CSS class */}
        <Link
          href="/login"
          id="client-login-cta"
          aria-label="Client Login"
          className="nav-cta inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium text-white select-none"
          style={{ background: "#0071E3" }}
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Client Login
        </Link>
      </div>

      {/* Nav link hover styles */}
      <style>{`
        .omniflow-navlink { transition: color 0.15s ease; }
        a:hover .omniflow-navlink { color: #0071E3; }
      `}</style>
    </header>
  );
}
