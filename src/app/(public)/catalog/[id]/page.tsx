import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MODELS, PICKUP_LOCATIONS, formatPrintTime } from "@/lib/mock-models";
import ModelViewer from "@/components/catalog/ModelViewer";
import ConfiguratorPanel from "@/components/catalog/ConfiguratorPanel";

export function generateStaticParams() {
  return MODELS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const model = MODELS.find((m) => m.id === id);
  if (!model) return { title: "Not Found" };
  return {
    title: `${model.title} — DEWA 3D Print Service`,
    description: model.description,
  };
}

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const model = MODELS.find((m) => m.id === id);
  if (!model) notFound();

  return (
    <div style={{ backgroundColor: "var(--color-surface)" }}>
      {/* Breadcrumb */}
      <div
        className="border-b"
        style={{ backgroundColor: "var(--color-canvas)", borderColor: "var(--color-border)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2">
          <Link
            href="/catalog"
            className="flex items-center gap-1.5 font-mono text-xs transition-colors hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
            style={{ color: "var(--color-muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Model Catalog
          </Link>
          <span style={{ color: "var(--color-border)" }}>/</span>
          <span className="font-mono text-xs truncate" style={{ color: "var(--color-subtle)" }}>
            {model.title}
          </span>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-10 items-start">

          {/* ── Left: Preview ──────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Preview frame */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ height: 420, border: "1px solid rgba(58,171,160,0.15)" }}
            >
              <ModelViewer
                src={model.glb_file_url}
                title={model.title}
                category={model.category}
              />
            </div>

            {/* Model meta */}
            <div
              className="rounded-xl p-4 flex flex-wrap gap-3 items-center"
              style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
            >
              {/* Category */}
              <span
                className="font-mono text-[10px] px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "var(--color-teal-50)", color: "var(--color-teal-700)", border: "1px solid var(--color-teal-200)" }}
              >
                {model.category}
              </span>

              {/* Tags */}
              {model.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "var(--color-surface)", color: "var(--color-subtle)", border: "1px solid var(--color-border)" }}
                >
                  {tag}
                </span>
              ))}

              {/* Divider + print time */}
              <div className="ml-auto flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="6" stroke="var(--color-subtle)" strokeWidth="1.5" />
                  <path d="M7 4v3.5L9.5 9" stroke="var(--color-subtle)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="font-mono text-[10px]" style={{ color: "var(--color-subtle)" }}>
                  {formatPrintTime(model.base_print_time_minutes)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: Info + Configurator ─────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Title + description */}
            <div>
              <h1
                className="font-display text-2xl font-bold mb-3 leading-tight"
                style={{ color: "var(--color-ink)" }}
              >
                {model.title}
              </h1>
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: "var(--color-muted)" }}
              >
                {model.description}
              </p>
            </div>

            {/* Divider */}
            <hr style={{ borderColor: "var(--color-border)" }} />

            {/* Configurator card */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
            >
              <p
                className="font-display font-semibold text-sm mb-5"
                style={{ color: "var(--color-ink)" }}
              >
                Configure your request
              </p>
              <ConfiguratorPanel
                modelId={model.id}
                colors={model.available_colors}
                locations={PICKUP_LOCATIONS}
                basePrintMinutes={model.base_print_time_minutes}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
