"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { type Model, formatPrintTime } from "@/lib/mock-models";

// ── SVG placeholders keyed by category ──────────────────────────
function ModelIcon({ category }: { category: string }) {
  const cls = "w-14 h-14";
  const stroke = "var(--color-teal-400)";

  switch (category) {
    case "Workspace":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" className={cls}>
          <rect x="8" y="20" width="48" height="28" rx="2" />
          <line x1="8" y1="30" x2="56" y2="30" />
          <line x1="20" y1="20" x2="20" y2="48" />
          <circle cx="14" cy="25" r="2" fill={stroke} />
        </svg>
      );
    case "Fixtures":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" className={cls}>
          <path d="M14 14 L14 50 L50 50" />
          <path d="M14 14 L24 14 L24 40 L50 40 L50 50" strokeWidth="0.75" opacity="0.5" />
          <circle cx="19" cy="24" r="4" />
          <circle cx="42" cy="45" r="4" />
        </svg>
      );
    case "Signage":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" className={cls}>
          <rect x="8" y="18" width="48" height="28" rx="2" />
          <line x1="8" y1="28" x2="56" y2="28" strokeWidth="0.75" opacity="0.4" />
          <line x1="14" y1="36" x2="36" y2="36" strokeWidth="2" />
          <line x1="14" y1="42" x2="28" y2="42" opacity="0.5" />
          <circle cx="48" cy="38" r="5" />
        </svg>
      );
    case "Network":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" className={cls}>
          <rect x="8" y="22" width="48" height="20" rx="2" />
          <circle cx="18" cy="32" r="3" />
          <circle cx="28" cy="32" r="3" />
          <circle cx="38" cy="32" r="3" />
          <circle cx="48" cy="32" r="3" />
          <path d="M18 22 L18 16 M28 22 L28 16 M38 22 L38 16 M48 22 L48 16" strokeWidth="1" opacity="0.5" />
        </svg>
      );
    case "Workshop":
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" className={cls}>
          <path d="M32 10 L32 48" />
          <path d="M20 20 C20 14 44 14 44 20 L40 32 L24 32 Z" />
          <line x1="24" y1="36" x2="40" y2="36" />
          <line x1="26" y1="40" x2="38" y2="40" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" className={cls}>
          <rect x="12" y="12" width="40" height="40" rx="4" />
          <line x1="12" y1="28" x2="52" y2="28" strokeWidth="0.75" opacity="0.4" />
          <line x1="28" y1="12" x2="28" y2="52" strokeWidth="0.75" opacity="0.4" />
        </svg>
      );
  }
}

// ── Single model card ────────────────────────────────────────────
function ModelCard({ model }: { model: Model }) {
  return (
    <Link
      href={`/catalog/${model.id}`}
      className="group block rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
      style={{ backgroundColor: "var(--color-canvas)", borderColor: "var(--color-border)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "1", backgroundColor: "#F2F5F4" }}>
        {model.images[0] ? (
          <img
            src={model.images[0]}
            alt={model.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="tech-grid w-full h-full flex items-center justify-center" style={{ backgroundColor: "#0F1D1B" }}>
            <div className="transition-transform duration-300 group-hover:scale-105">
              <ModelIcon category={model.category} />
            </div>
          </div>
        )}
        <span
          className="absolute bottom-2.5 right-2.5 font-mono text-[10px] px-2 py-0.5 rounded"
          style={{ backgroundColor: "rgba(11,61,58,0.9)", color: "var(--color-teal-300)", border: "1px solid rgba(58,171,160,0.2)" }}
        >
          {formatPrintTime(model.base_print_time_minutes)}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display font-semibold text-sm leading-snug" style={{ color: "var(--color-ink)" }}>
            {model.title}
          </h3>
          <span
            className="font-mono text-[9px] px-1.5 py-0.5 rounded-full shrink-0 mt-0.5 whitespace-nowrap"
            style={{ backgroundColor: "var(--color-teal-50)", color: "var(--color-teal-700)", border: "1px solid var(--color-teal-200)" }}
          >
            {model.category}
          </span>
        </div>

        <p className="font-sans text-xs leading-relaxed line-clamp-2" style={{ color: "var(--color-muted)" }}>
          {model.description}
        </p>

        {/* Colour swatches */}
        <div className="flex items-center gap-1.5 mt-3">
          <span className="font-mono text-[10px]" style={{ color: "var(--color-subtle)" }}>Colour:</span>
          {model.available_colors.map((c) => (
            <span
              key={c.id}
              title={c.name}
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: c.hex, borderColor: "var(--color-border)" }}
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
  );
}

// ── Empty state ──────────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      {/* Blueprint grid background area */}
      <div
        className="blueprint-grid w-32 h-32 rounded-xl flex items-center justify-center mb-6"
        style={{ border: "1px dashed var(--color-border)" }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--color-subtle)" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="18" cy="18" r="10" />
          <path d="M26 26 L34 34" />
          <line x1="13" y1="18" x2="23" y2="18" />
        </svg>
      </div>
      <p className="font-display font-semibold text-base" style={{ color: "var(--color-ink)" }}>
        No models match &ldquo;{query}&rdquo;
      </p>
      <p className="font-sans text-sm mt-1" style={{ color: "var(--color-muted)" }}>
        Try a different search term or browse all categories.
      </p>
    </div>
  );
}

// ── Main grid component ──────────────────────────────────────────
export default function CatalogGrid({ models }: { models: Model[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return models.filter((m) => {
      const matchesCategory = activeCategory === "All" || m.category === activeCategory;
      const matchesQuery =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.includes(q)) ||
        m.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [models, query, activeCategory]);

  const categories = ["All", ...Array.from(new Set(models.map((m) => m.category))).sort()];

  return (
    <>
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width="15" height="15" viewBox="0 0 15 15" fill="none"
            aria-hidden="true"
          >
            <circle cx="6.5" cy="6.5" r="4.5" stroke="var(--color-subtle)" strokeWidth="1.5" />
            <path d="M10 10 L13.5 13.5" stroke="var(--color-subtle)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search models…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border pl-9 pr-3 py-2.5 font-sans text-sm outline-none transition-colors"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-canvas)", color: "var(--color-ink)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-teal-500)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-2 rounded-lg font-mono text-xs transition-colors whitespace-nowrap"
              style={
                activeCategory === cat
                  ? { backgroundColor: "var(--color-teal-900)", color: "#fff" }
                  : { backgroundColor: "var(--color-canvas)", color: "var(--color-muted)", border: "1px solid var(--color-border)" }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="font-mono text-xs mb-5" style={{ color: "var(--color-subtle)" }}>
        {filtered.length} {filtered.length === 1 ? "model" : "models"}
        {activeCategory !== "All" && ` in ${activeCategory}`}
        {query && ` matching "${query}"`}
      </p>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <EmptyState query={query || activeCategory} />
        ) : (
          filtered.map((model) => <ModelCard key={model.id} model={model} />)
        )}
      </div>
    </>
  );
}
