import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Request Received — DEWA 3D Print Service",
};

const STEPS = [
  {
    title: "Request queued",
    body: "Your request is now in the fabrication queue. The admin team has been notified.",
  },
  {
    title: "Part fabricated",
    body: "The DEWA team will 3D print your part and run a quality check before it's ready.",
  },
  {
    title: "Ready for collection",
    body: "You'll receive a call or email when your part is available at your chosen location.",
  },
];

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string; pickup?: string; color?: string }>;
}) {
  const { model, pickup, color } = await searchParams;

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-start justify-center px-6 pt-16 pb-20"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="w-full max-w-md">

        {/* ── Check mark ─────────────────────────────────────────── */}
        <div className="flex justify-center mb-7">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "var(--color-teal-50)",
              border: "2px solid var(--color-teal-200)",
              animation: "fade-up 0.45s ease both",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <path
                d="M7 17.5l7 7 13-15"
                stroke="var(--color-teal-600)"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* ── Heading ────────────────────────────────────────────── */}
        <div className="text-center mb-6">
          <h1
            className="font-display text-3xl font-bold mb-2"
            style={{ color: "var(--color-ink)" }}
          >
            Request received
          </h1>
          <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
            {model
              ? <>Your request for <strong style={{ color: "var(--color-ink)" }}>{model}</strong> has been submitted.</>
              : "Your 3D print request has been submitted."}
          </p>
        </div>

        {/* ── Request chip ───────────────────────────────────────── */}
        {(model || pickup || color) && (
          <div
            className="rounded-xl p-4 mb-7 flex flex-wrap gap-3"
            style={{
              backgroundColor: "var(--color-canvas)",
              border: "1px solid var(--color-border)",
            }}
          >
            {model && (
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] mb-0.5" style={{ color: "var(--color-subtle)" }}>MODEL</p>
                <p className="font-sans text-sm font-medium truncate" style={{ color: "var(--color-ink)" }}>{model}</p>
              </div>
            )}
            {color && (
              <div>
                <p className="font-mono text-[10px] mb-0.5" style={{ color: "var(--color-subtle)" }}>COLOUR</p>
                <p className="font-sans text-sm" style={{ color: "var(--color-ink)" }}>{color}</p>
              </div>
            )}
            {pickup && (
              <div>
                <p className="font-mono text-[10px] mb-0.5" style={{ color: "var(--color-subtle)" }}>PICKUP</p>
                <div className="flex items-center gap-1">
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
                    <path d="M5 0C2.24 0 0 2.19 0 4.88c0 3.53 5 7.12 5 7.12S10 8.41 10 4.88C10 2.19 7.76 0 5 0z" fill="var(--color-teal-500)" />
                    <circle cx="5" cy="4.88" r="1.75" fill="white" />
                  </svg>
                  <p className="font-sans text-sm" style={{ color: "var(--color-ink)" }}>{pickup}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── What happens next ──────────────────────────────────── */}
        <div className="mb-8">
          <p
            className="font-mono text-[10px] tracking-widest uppercase mb-4"
            style={{ color: "var(--color-subtle)" }}
          >
            What happens next
          </p>

          <ol className="flex flex-col gap-0">
            {STEPS.map((step, i) => (
              <li key={i} className="flex gap-4">
                {/* Step indicator + connector */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold"
                    style={{ backgroundColor: "var(--color-teal-900)", color: "#fff" }}
                  >
                    {i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="w-px flex-1 my-1"
                      style={{ backgroundColor: "var(--color-teal-100)", minHeight: 24 }}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className="pb-5">
                  <p className="font-display font-semibold text-sm mb-0.5" style={{ color: "var(--color-ink)" }}>
                    {step.title}
                  </p>
                  <p className="font-sans text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ── CTAs ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <Link
            href="/catalog"
            className="w-full py-3 rounded-xl font-display font-semibold text-sm text-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            style={{ backgroundColor: "var(--color-teal-900)", color: "#fff" }}
          >
            Browse more models
          </Link>
          <Link
            href="/"
            className="w-full py-2.5 rounded-xl font-sans text-sm text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            style={{ color: "var(--color-muted)", border: "1px solid var(--color-border)" }}
          >
            Back to home
          </Link>
        </div>

        <p
          className="font-mono text-[10px] text-center mt-6"
          style={{ color: "var(--color-subtle)" }}
        >
          DEWA 3D Print Service · Internal use only
        </p>

      </div>
    </div>
  );
}
