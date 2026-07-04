/**
 * app/login/page.tsx
 * ─────────────────────────────────────────────────────────────────
 * OmniFlow CRM — Login page
 * Apple-style light theme, Supabase email/password auth.
 * On success Supabase sets the session cookie and middleware
 * keeps it fresh across all subsequent SSR requests.
 * ─────────────────────────────────────────────────────────────────
 */

"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: `
          radial-gradient(ellipse 90% 60% at 50% -5%, rgba(219,234,254,0.65) 0%, transparent 55%),
          #F4F7FA
        `,
      }}
    >
      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl bg-white px-8 py-10"
        style={{
          border:    "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, #2563EB, #4F46E5)" }}
          >
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
              <path d="M4 14 L8 8 L12 11 L16 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="4"  cy="14" r="1.5" fill="white" />
              <circle cx="16" cy="5"  r="1.5" fill="white" />
            </svg>
          </div>
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: "#111827", letterSpacing: "-0.018em" }}
          >
            Sign in to OmniFlow
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Enterprise CRM & Operations Platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold mb-1.5"
              style={{ color: "#374151" }}
            >
              Work email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-shadow"
              style={{
                background:  "#F9FAFB",
                border:      "1px solid rgba(0,0,0,0.1)",
                color:       "#111827",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold"
                style={{ color: "#374151" }}
              >
                Password
              </label>
              <a href="#" className="text-xs" style={{ color: "#2563EB" }}>
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-shadow"
              style={{
                background: "#F9FAFB",
                border:     "1px solid rgba(0,0,0,0.1)",
                color:      "#111827",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="px-3.5 py-2.5 rounded-xl text-xs font-medium"
              style={{ background: "rgba(239,68,68,0.08)", color: "#DC2626" }}
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #2563EB, #4F46E5)" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.07)" }} />
          <span className="text-xs" style={{ color: "#9CA3AF" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.07)" }} />
        </div>

        {/* SSO hint */}
        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{
            background: "#F9FAFB",
            border:     "1px solid rgba(0,0,0,0.09)",
            color:      "#374151",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google SSO
        </button>

        {/* Footer */}
        <p className="text-xs text-center mt-6" style={{ color: "#9CA3AF" }}>
          By signing in, you agree to our{" "}
          <a href="#" style={{ color: "#2563EB" }}>Terms</a> and{" "}
          <a href="#" style={{ color: "#2563EB" }}>Privacy Policy</a>.
        </p>
      </div>

      {/* Back to home */}
      <Link
        href="/"
        className="mt-6 text-xs flex items-center gap-1.5 transition-colors"
        style={{ color: "#9CA3AF" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to homepage
      </Link>
    </div>
  );
}
