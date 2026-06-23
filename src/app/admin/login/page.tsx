"use client";

import { useState } from "react";
import { signIn } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn(email, password);

    // signIn either redirects (success) or returns { error }
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 text-center">
          <p className="font-display font-bold text-xl tracking-tight" style={{ color: "var(--color-ink)" }}>
            DEWA
          </p>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase mt-0.5" style={{ color: "var(--color-muted)" }}>
            3D Print Service
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border p-8" style={{ backgroundColor: "var(--color-canvas)", borderColor: "var(--color-border)" }}>
          <h1 className="font-display font-bold text-lg mb-1" style={{ color: "var(--color-ink)" }}>
            Admin sign in
          </h1>
          <p className="font-sans text-sm mb-6" style={{ color: "var(--color-muted)" }}>
            Restricted to authorised DEWA staff.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-mono text-xs" style={{ color: "var(--color-muted)" }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-3 py-2.5 font-sans text-sm outline-none"
                style={{ borderColor: "var(--color-border)", color: "var(--color-ink)", backgroundColor: "var(--color-canvas)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-teal-600)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-mono text-xs" style={{ color: "var(--color-muted)" }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border px-3 py-2.5 font-sans text-sm outline-none"
                style={{ borderColor: "var(--color-border)", color: "var(--color-ink)", backgroundColor: "var(--color-canvas)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-teal-600)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              />
            </div>

            {error && (
              <p
                className="font-sans text-sm rounded-lg px-3 py-2.5"
                style={{ color: "#B91C1C", backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-2.5 font-display font-semibold text-sm transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "var(--color-teal-900)", color: "#FFFFFF" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-[10px] mt-6" style={{ color: "var(--color-subtle)" }}>
          Dubai Electricity and Water Authority
        </p>
      </div>
    </div>
  );
}
