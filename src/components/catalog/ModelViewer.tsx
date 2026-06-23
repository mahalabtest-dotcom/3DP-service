"use client";

import Script from "next/script";

// ── Category placeholder icons (same as CatalogGrid but larger) ─
function PreviewIcon({ category }: { category: string }) {
  const stroke = "var(--color-teal-400)";
  const cls = "w-24 h-24";

  switch (category) {
    case "Workspace":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" className={cls}>
          <rect x="8" y="20" width="48" height="28" rx="2" />
          <line x1="8" y1="30" x2="56" y2="30" />
          <line x1="20" y1="20" x2="20" y2="48" />
          <circle cx="14" cy="25" r="2" fill={stroke} />
        </svg>
      );
    case "Fixtures":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" className={cls}>
          <path d="M14 14 L14 50 L50 50" />
          <path d="M14 14 L24 14 L24 40 L50 40 L50 50" strokeWidth="0.5" opacity="0.5" />
          <circle cx="19" cy="24" r="4" />
          <circle cx="42" cy="45" r="4" />
        </svg>
      );
    case "Signage":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" className={cls}>
          <rect x="8" y="18" width="48" height="28" rx="2" />
          <line x1="8" y1="28" x2="56" y2="28" strokeWidth="0.5" opacity="0.4" />
          <line x1="14" y1="36" x2="36" y2="36" strokeWidth="1.5" />
          <line x1="14" y1="42" x2="28" y2="42" opacity="0.5" />
          <circle cx="48" cy="38" r="5" />
        </svg>
      );
    case "Network":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" className={cls}>
          <rect x="8" y="22" width="48" height="20" rx="2" />
          <circle cx="18" cy="32" r="3" />
          <circle cx="28" cy="32" r="3" />
          <circle cx="38" cy="32" r="3" />
          <circle cx="48" cy="32" r="3" />
          <path d="M18 22 L18 16 M28 22 L28 16 M38 22 L38 16 M48 22 L48 16" strokeWidth="0.75" opacity="0.5" />
        </svg>
      );
    case "Workshop":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" className={cls}>
          <path d="M32 10 L32 48" />
          <path d="M20 20 C20 14 44 14 44 20 L40 32 L24 32 Z" />
          <line x1="24" y1="36" x2="40" y2="36" />
          <line x1="26" y1="40" x2="38" y2="40" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" className={cls}>
          <rect x="12" y="12" width="40" height="40" rx="4" />
          <line x1="12" y1="28" x2="52" y2="28" strokeWidth="0.5" opacity="0.4" />
          <line x1="28" y1="12" x2="28" y2="52" strokeWidth="0.5" opacity="0.4" />
        </svg>
      );
  }
}

// ── Placeholder shown when no GLB is uploaded yet ────────────────
function Placeholder({ category, title }: { category: string; title: string }) {
  return (
    <div
      className="tech-grid w-full h-full flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: "#0A1A18" }}
    >
      <div style={{ opacity: 0.9 }}>
        <PreviewIcon category={category} />
      </div>
      <div className="text-center px-6">
        <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: "var(--color-teal-600)" }}>
          3D Preview
        </p>
        <p className="font-sans text-xs" style={{ color: "var(--color-teal-700)" }}>
          GLB file not yet uploaded
        </p>
      </div>
      {/* Animated layer lines for visual interest */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ height: 40 }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="layer-line"
            style={{
              bottom: i * 6,
              animationDelay: `${0.1 + i * 0.12}s`,
              opacity: 0.35 - i * 0.05,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────
export default function ModelViewer({
  src,
  title,
  category,
}: {
  src: string | null;
  title: string;
  category: string;
}) {
  if (!src) {
    return <Placeholder category={category} title={title} />;
  }

  return (
    <>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        strategy="lazyOnload"
      />
      {/* @ts-expect-error – model-viewer is a web component, not in JSX types */}
      <model-viewer
        src={src}
        alt={title}
        camera-controls=""
        auto-rotate=""
        shadow-intensity="1"
        style={{ width: "100%", height: "100%", backgroundColor: "#F2F5F4" }}
      />
    </>
  );
}
