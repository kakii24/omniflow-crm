// Footer.tsx — RSC, light Apple aesthetic
import Link from "next/link";

const footerLinks = {
  Platform: ["Dashboard", "Security", "Inventory", "Financials", "Integrations"],
  Company: ["About", "Careers", "Press", "Partners", "Blog"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
  Support: ["Documentation", "API Reference", "Status Page", "Contact"],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      aria-label="OmniFlow CRM site footer"
      className="relative"
      style={{
        borderTop: "1px solid rgba(0,0,0,0.07)",
        background: "#F5F5F7",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-16">
        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "#0071E3" }}
              >
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
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
                className="text-[15px] font-semibold"
                style={{ color: "#1D1D1F", letterSpacing: "-0.01em" }}
              >
                OmniFlow
              </span>
            </div>

            <p
              className="text-sm leading-relaxed mb-7 max-w-xs"
              style={{ color: "#6E6E73" }}
            >
              Enterprise multi-tenant CRM engineered for security, financial clarity,
              and supply-chain precision.
            </p>

            {/* Compliance badges */}
            <div className="flex flex-wrap gap-2">
              {["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"].map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] font-medium tracking-wide px-2.5 py-1 rounded-full"
                  style={{
                    color: "#6E6E73",
                    border: "1px solid rgba(0,0,0,0.1)",
                    background: "white",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <nav
              key={category}
              aria-label={`${category} links`}
              className="flex flex-col gap-4"
            >
              <h4
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#1D1D1F" }}
              >
                {category}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm transition-colors duration-150 footer-link"
                      style={{ color: "#6E6E73" }}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Separator */}
        <div
          aria-hidden="true"
          className="mb-8"
          style={{ height: "1px", background: "rgba(0,0,0,0.08)" }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "#AEAEB2" }}>
            © {currentYear} OmniFlow Technologies, Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: "#AEAEB2" }}>Status:</span>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium"
              style={{ color: "#1A8A3C" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: #0071E3; }
      `}</style>
    </footer>
  );
}
