import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Blueprint grid motif */}
      <div
        className="w-24 h-24 rounded-2xl flex items-center justify-center mb-8"
        style={{ backgroundColor: "var(--color-teal-50)", border: "1px solid var(--color-teal-100)" }}
      >
        <svg viewBox="0 0 48 48" className="w-14 h-14" fill="none">
          {/* Wireframe question mark form */}
          <rect x="8" y="8" width="32" height="32" rx="2" stroke="var(--color-teal-300)" strokeWidth="1" strokeDasharray="3 2" />
          <text x="24" y="33" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="22" fill="var(--color-teal-500)" fontWeight="300">
            ?
          </text>
        </svg>
      </div>

      <p
        className="font-mono text-xs tracking-widest uppercase mb-3"
        style={{ color: "var(--color-subtle)" }}
      >
        404 — not found
      </p>

      <h1
        className="font-display font-bold text-3xl mb-3"
        style={{ color: "var(--color-ink)" }}
      >
        Page not found
      </h1>
      <p className="font-sans text-base max-w-sm mb-8" style={{ color: "var(--color-muted)" }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/catalog"
          className="font-sans text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity"
          style={{ backgroundColor: "var(--color-teal-700)", color: "#fff" }}
        >
          Browse catalog
        </Link>
        <Link
          href="/"
          className="font-sans text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          style={{
            backgroundColor: "transparent",
            color: "var(--color-teal-700)",
            border: "1px solid var(--color-teal-200)",
          }}
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
