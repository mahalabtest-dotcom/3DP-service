import type { Metadata } from "next";
import { MODELS } from "@/lib/mock-models";
import CatalogGrid from "@/components/catalog/CatalogGrid";

export const metadata: Metadata = {
  title: "Catalog — DEWA 3D Print Service",
  description: "Browse printable models available for DEWA employees.",
};

export default function CatalogPage() {
  return (
    <div style={{ backgroundColor: "var(--color-surface)" }}>
      {/* Page header */}
      <div
        className="border-b"
        style={{ backgroundColor: "var(--color-canvas)", borderColor: "var(--color-border)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--color-teal-600)" }}>
            DEWA 3D Print Service
          </p>
          <h1 className="font-display text-3xl font-bold mb-2" style={{ color: "var(--color-ink)" }}>
            Model Catalog
          </h1>
          <p className="font-sans text-sm" style={{ color: "var(--color-muted)", maxWidth: 520 }}>
            Browse available 3D-printable parts. Select a model to configure colour,
            pickup location, and submit your request.
          </p>
        </div>
      </div>

      {/* Grid + controls */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <CatalogGrid models={MODELS} />
      </div>
    </div>
  );
}
