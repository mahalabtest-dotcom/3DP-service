import Link from "next/link";

/* Pre-defined layer positions to avoid Math.random() hydration issues */
const LAYERS = [
  { bottom: 8,  delay: 0.00 },
  { bottom: 11, delay: 0.05 },
  { bottom: 14, delay: 0.10 },
  { bottom: 17, delay: 0.15 },
  { bottom: 20, delay: 0.20 },
  { bottom: 23, delay: 0.25 },
  { bottom: 26, delay: 0.30 },
  { bottom: 29, delay: 0.35 },
  { bottom: 32, delay: 0.40 },
  { bottom: 35, delay: 0.45 },
  { bottom: 38, delay: 0.50 },
  { bottom: 41, delay: 0.55 },
  { bottom: 44, delay: 0.60 },
  { bottom: 47, delay: 0.65 },
  { bottom: 50, delay: 0.70 },
  { bottom: 53, delay: 0.75 },
  { bottom: 56, delay: 0.80 },
  { bottom: 59, delay: 0.85 },
  { bottom: 62, delay: 0.90 },
  { bottom: 65, delay: 0.95 },
  { bottom: 68, delay: 1.00 },
  { bottom: 71, delay: 1.05 },
  { bottom: 74, delay: 1.10 },
  { bottom: 77, delay: 1.15 },
];

const SPECS = [
  ["PROCESS", "FDM"],
  ["MATERIAL", "PLA / PETG"],
  ["LAYER HT.", "0.2 mm"],
  ["NOZZLE", "0.4 mm"],
  ["COLOURS", "3 options"],
  ["PICKUP SITES", "4 locations"],
];

const CATALOG_PREVIEW = [
  {
    label: "Cable Management",
    category: "Workspace",
    time: "~1.5 hrs",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M20 18 C8 18 8 62 20 62 L52 62 C66 62 66 48 52 48 L28 48 C19 48 19 32 28 32 L52 32" />
        <circle cx="20" cy="18" r="4" />
        <circle cx="52" cy="32" r="3" strokeWidth="1" />
        <circle cx="52" cy="62" r="4" />
      </svg>
    ),
  },
  {
    label: "Mounting Bracket",
    category: "Fixtures",
    time: "~2.0 hrs",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M15 15 L15 65 L65 65" />
        <path d="M15 15 L26 15 L26 54 L65 54 L65 65" strokeWidth="0.75" opacity="0.45" />
        <circle cx="21" cy="27" r="4.5" />
        <circle cx="53" cy="59" r="4.5" />
        <line x1="15" y1="39" x2="26" y2="39" strokeWidth="0.75" opacity="0.3" />
        <line x1="39" y1="54" x2="39" y2="65" strokeWidth="0.75" opacity="0.3" />
      </svg>
    ),
  },
  {
    label: "ID Nameplate",
    category: "Signage",
    time: "~0.75 hrs",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="8" y="22" width="64" height="36" rx="3" />
        <rect x="8" y="22" width="64" height="10" rx="3" strokeWidth="0.75" opacity="0.35" />
        <line x1="16" y1="42" x2="44" y2="42" strokeWidth="2" />
        <line x1="16" y1="49" x2="36" y2="49" strokeWidth="1.5" opacity="0.5" />
        <circle cx="60" cy="40" r="5" />
        <circle cx="60" cy="40" r="2.5" strokeWidth="0.75" opacity="0.5" />
      </svg>
    ),
  },
];

const PROCESS_STEPS = [
  { label: "Browse",    detail: "Find your model",   yours: true  },
  { label: "Configure", detail: "Colour & site",     yours: true  },
  { label: "Submit",    detail: "One form, 2 min",   yours: true  },
  { label: "Print",     detail: "1–3 days",          yours: false },
  { label: "Collect",   detail: "At your facility",  yours: false },
];

const LOCATIONS = ["Al Sheraa", "Hudaiba", "Al Quoz", "Al Ruwayyah"];

export default function Home() {
  return (
    <>
      {/* ═══════════════════════════════════════
          HERO — print chamber with layer animation
          ═══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{ backgroundColor: "var(--color-void)", minHeight: "88vh" }}
      >
        {/* Layer-build animation */}
        <div className="layer-stack" aria-hidden="true">
          {LAYERS.map((layer, i) => (
            <div
              key={i}
              className="layer-line"
              style={{
                bottom: `${layer.bottom}%`,
                animationDelay: `${layer.delay}s`,
              }}
            />
          ))}
          {/* Nozzle indicator — bottom quarter of hero */}
          <div
            className="nozzle-dot"
            style={{ bottom: "calc(8% - 3px)" }}
          />
        </div>

        {/* Subtle radial glow behind text */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 30% 85%, rgba(26,122,114,0.12) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-32 w-full">
          {/* Technical eyebrow */}
          <p
            className="font-mono text-xs tracking-[0.3em] uppercase mb-8"
            style={{ color: "var(--color-teal-600)" }}
          >
            FDM · PLA / PETG · DEWA Facilities
          </p>

          {/* Headline */}
          <h1
            className="font-display font-bold leading-none tracking-tight mb-8"
            style={{
              fontSize: "clamp(3rem, 10vw, 7rem)",
              color: "#FFFFFF",
              maxWidth: "14ch",
            }}
          >
            From{" "}
            <span style={{ color: "var(--color-teal-400)" }}>0 mm</span>
            <br />
            to done.
          </h1>

          <p
            className="font-sans text-lg leading-relaxed mb-10"
            style={{ color: "var(--color-teal-200)", maxWidth: "42ch" }}
          >
            Browse our catalog of printable models, choose your filament colour
            and pickup location, then submit your request.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2.5 rounded-lg font-display font-semibold text-sm px-6 py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-void"
              style={{ color: "var(--color-void)" }}
            >
              Browse catalog
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <path d="M2.5 7.5h10M8.5 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <span className="font-mono text-xs" style={{ color: "var(--color-teal-700)" }}>
              40+ models &nbsp;·&nbsp; 3 colours &nbsp;·&nbsp; 4 locations
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRINTER SPEC STRIP
          ═══════════════════════════════════════ */}
      <div
        className="border-y overflow-x-auto"
        style={{
          backgroundColor: "#0C1714",
          borderColor: "rgba(26,122,114,0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-0 font-mono text-[11px] whitespace-nowrap">
            {SPECS.map(([key, val], i) => (
              <span key={key} className="flex items-center gap-0">
                {i > 0 && (
                  <span
                    className="mx-5"
                    style={{ color: "rgba(26,122,114,0.35)" }}
                  >
                    ·
                  </span>
                )}
                <span style={{ color: "var(--color-teal-700)" }}>
                  {key}
                </span>
                <span
                  className="ml-2 font-medium"
                  style={{ color: "var(--color-teal-400)" }}
                >
                  {val}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          CATALOG PREVIEW
          ═══════════════════════════════════════ */}
      <section
        className="py-20"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10 gap-4">
            <h2
              className="font-display font-bold"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--color-ink)" }}
            >
              From the catalog
            </h2>
            <Link
              href="/catalog"
              className="font-mono text-xs tracking-wide transition-colors"
              style={{ color: "var(--color-teal-600)" }}
            >
              View all →
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {CATALOG_PREVIEW.map(({ label, category, time, icon }) => (
              <Link
                href="/catalog"
                key={label}
                className="group block rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                style={{
                  backgroundColor: "var(--color-canvas)",
                  borderColor: "var(--color-border)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {/* Thumbnail */}
                <div
                  className="tech-grid relative flex items-center justify-center"
                  style={{
                    height: "180px",
                    backgroundColor: "#0F1D1B",
                  }}
                >
                  <div
                    className="w-20 h-20 transition-transform duration-300 group-hover:scale-105"
                    style={{ color: "var(--color-teal-400)" }}
                  >
                    {icon}
                  </div>
                  {/* Print time badge */}
                  <div
                    className="absolute bottom-3 right-3 font-mono text-[10px] px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: "rgba(11,61,58,0.9)",
                      color: "var(--color-teal-300)",
                      border: "1px solid rgba(58,171,160,0.2)",
                    }}
                  >
                    {time}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      className="font-display font-semibold text-base leading-tight"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {label}
                    </h3>
                    <span
                      className="font-mono text-[10px] px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                      style={{
                        backgroundColor: "var(--color-teal-50)",
                        color: "var(--color-teal-700)",
                        border: "1px solid var(--color-teal-200)",
                      }}
                    >
                      {category}
                    </span>
                  </div>

                  {/* Colour swatches */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Colour:
                    </span>
                    {["#1C2B2A", "#FFFFFF", "#9FD4D0"].map((hex) => (
                      <span
                        key={hex}
                        className="w-3.5 h-3.5 rounded-full border"
                        style={{
                          backgroundColor: hex,
                          borderColor: "var(--color-border)",
                        }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                {/* Hover accent */}
                <div
                  className="h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ backgroundColor: "var(--color-teal-400)" }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRINT JOB PROCESS TRACK
          ═══════════════════════════════════════ */}
      <section
        className="py-20 border-t"
        style={{
          backgroundColor: "var(--color-canvas)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <p
              className="font-mono text-xs tracking-[0.25em] uppercase mb-2"
              style={{ color: "var(--color-muted)" }}
            >
              Request lifecycle
            </p>
            <h2
              className="font-display font-bold"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--color-ink)" }}
            >
              How a request moves
            </h2>
          </div>

          {/* Track */}
          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute top-4 left-4 right-4 h-px hidden sm:block"
              style={{ backgroundColor: "var(--color-border)" }}
              aria-hidden="true"
            />

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-y-8 gap-x-0 relative">
              {PROCESS_STEPS.map(({ label, detail, yours }, i) => (
                <div key={label} className="flex flex-col items-start sm:items-center gap-3">
                  {/* Node */}
                  <div
                    className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-medium transition-colors"
                    style={
                      yours
                        ? {
                            backgroundColor: "var(--color-teal-900)",
                            color: "var(--color-teal-300)",
                            border: "2px solid var(--color-teal-700)",
                          }
                        : {
                            backgroundColor: "var(--color-canvas)",
                            color: "var(--color-muted)",
                            border: "2px solid var(--color-border)",
                          }
                    }
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Label */}
                  <div className="sm:text-center">
                    <p
                      className="font-display font-semibold text-sm"
                      style={{ color: yours ? "var(--color-ink)" : "var(--color-muted)" }}
                    >
                      {label}
                    </p>
                    <p
                      className="font-mono text-[10px] mt-0.5"
                      style={{ color: "var(--color-subtle)" }}
                    >
                      {detail}
                    </p>
                    {i === 2 && (
                      <span
                        className="inline-block font-mono text-[9px] px-1.5 py-px rounded mt-1"
                        style={{
                          backgroundColor: "var(--color-teal-50)",
                          color: "var(--color-teal-600)",
                          border: "1px solid var(--color-teal-200)",
                        }}
                      >
                        You stop here
                      </span>
                    )}
                    {i === 3 && (
                      <span
                        className="inline-block font-mono text-[9px] px-1.5 py-px rounded mt-1"
                        style={{
                          backgroundColor: "var(--color-amber-50)",
                          color: "var(--color-amber-600)",
                          border: "1px solid var(--color-amber-100)",
                        }}
                      >
                        DEWA handles
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PICKUP LOCATIONS
          ═══════════════════════════════════════ */}
      <section
        className="py-16 border-t"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div>
              <p
                className="font-mono text-xs tracking-[0.25em] uppercase mb-2"
                style={{ color: "var(--color-muted)" }}
              >
                Where to collect
              </p>
              <h2
                className="font-display font-bold text-xl"
                style={{ color: "var(--color-ink)" }}
              >
                Four DEWA pickup sites
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {LOCATIONS.map((loc) => (
                <div
                  key={loc}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border"
                  style={{
                    backgroundColor: "var(--color-canvas)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <svg
                    width="12"
                    height="14"
                    viewBox="0 0 12 14"
                    fill="none"
                    aria-hidden="true"
                    style={{ color: "var(--color-teal-500)" }}
                  >
                    <path
                      d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.75A1.75 1.75 0 1 1 6 3.25a1.75 1.75 0 0 1 0 3.5z"
                      fill="currentColor"
                    />
                  </svg>
                  <span
                    className="font-sans text-sm font-medium"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {loc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
