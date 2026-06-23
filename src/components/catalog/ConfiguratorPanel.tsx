"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Color, type PickupLocation, formatPrintTime } from "@/lib/mock-models";

export default function ConfiguratorPanel({
  modelId,
  colors,
  locations,
  basePrintMinutes,
}: {
  modelId: string;
  colors: Color[];
  locations: PickupLocation[];
  basePrintMinutes: number;
}) {
  const [selectedColor, setSelectedColor] = useState(colors[0]?.id ?? "");
  const [selectedLocation, setSelectedLocation] = useState(locations[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  function handleSubmit() {
    router.push(
      `/catalog/${modelId}/request?color=${selectedColor}&location=${selectedLocation}&qty=${quantity}`
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Colour ─────────────────────────────────────────────── */}
      <fieldset>
        <legend className="font-mono text-xs mb-3 block" style={{ color: "var(--color-muted)" }}>
          COLOUR
        </legend>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const active = selectedColor === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedColor(c.id)}
                title={c.name}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-sans transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                style={
                  active
                    ? {
                        borderColor: "var(--color-teal-500)",
                        backgroundColor: "var(--color-teal-50)",
                        color: "var(--color-teal-800)",
                        boxShadow: "0 0 0 1px var(--color-teal-500)",
                      }
                    : {
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-canvas)",
                        color: "var(--color-muted)",
                      }
                }
              >
                <span
                  className="w-4 h-4 rounded-full border shrink-0"
                  style={{ backgroundColor: c.hex, borderColor: "var(--color-border)" }}
                />
                {c.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* ── Pickup location ────────────────────────────────────── */}
      <fieldset>
        <legend className="font-mono text-xs mb-3 block" style={{ color: "var(--color-muted)" }}>
          PICKUP LOCATION
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {locations.map((loc) => {
            const active = selectedLocation === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => setSelectedLocation(loc.id)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-sans text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                style={
                  active
                    ? {
                        borderColor: "var(--color-teal-500)",
                        backgroundColor: "var(--color-teal-50)",
                        color: "var(--color-teal-800)",
                        boxShadow: "0 0 0 1px var(--color-teal-500)",
                      }
                    : {
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-canvas)",
                        color: "var(--color-muted)",
                      }
                }
              >
                {/* Map pin */}
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                  <path
                    d="M6 0C3.24 0 1 2.19 1 4.88c0 3.53 5 9.12 5 9.12s5-5.59 5-9.12C11 2.19 8.76 0 6 0z"
                    fill={active ? "var(--color-teal-500)" : "var(--color-border)"}
                  />
                  <circle cx="6" cy="4.88" r="1.75" fill="white" />
                </svg>
                <span className="leading-tight">{loc.name}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* ── Quantity ───────────────────────────────────────────── */}
      <fieldset>
        <legend className="font-mono text-xs mb-3 block" style={{ color: "var(--color-muted)" }}>
          QUANTITY
        </legend>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="w-9 h-9 rounded-lg border flex items-center justify-center font-mono text-lg transition-all duration-150 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-canvas)", color: "var(--color-ink)" }}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span
            className="font-mono text-xl font-semibold min-w-[2ch] text-center"
            style={{ color: "var(--color-ink)" }}
            aria-live="polite"
            aria-label={`Quantity: ${quantity}`}
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            disabled={quantity >= 10}
            className="w-9 h-9 rounded-lg border flex items-center justify-center font-mono text-lg transition-all duration-150 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-canvas)", color: "var(--color-ink)" }}
            aria-label="Increase quantity"
          >
            +
          </button>
          <span className="font-mono text-[10px]" style={{ color: "var(--color-subtle)" }}>
            max 10 per request
          </span>
        </div>
      </fieldset>

      {/* ── Print time ─────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between rounded-lg px-4 py-3"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="var(--color-muted)" strokeWidth="1.5" />
            <path d="M7 4v3.5L9.5 9" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-xs" style={{ color: "var(--color-muted)" }}>
            EST. PRINT TIME{quantity > 1 ? ` × ${quantity}` : ""}
          </span>
        </div>
        <span className="font-mono text-sm font-semibold" style={{ color: "var(--color-teal-700)" }}>
          {formatPrintTime(basePrintMinutes * quantity)}
        </span>
      </div>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full py-3.5 rounded-xl font-display font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-[0.98]"
        style={{ backgroundColor: "var(--color-amber-500)", color: "#1C2B2A" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-amber-400)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-amber-500)")}
      >
        Request this model
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <p className="font-mono text-[10px] text-center" style={{ color: "var(--color-subtle)" }}>
        You will be contacted when your print is ready
      </p>
    </div>
  );
}
