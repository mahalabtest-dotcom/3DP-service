import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MODELS, PICKUP_LOCATIONS } from "@/lib/mock-models";
import RequestForm from "@/components/catalog/RequestForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const model = MODELS.find((m) => m.id === id);
  if (!model) return { title: "Not Found" };
  return { title: `Request — ${model.title} — DEWA 3D Print Service` };
}

export default async function RequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color?: string; location?: string; qty?: string }>;
}) {
  const { id } = await params;
  const { color: colorId, location: locationId, qty } = await searchParams;
  const quantity = Math.min(10, Math.max(1, parseInt(qty ?? "1", 10) || 1));

  const model = MODELS.find((m) => m.id === id);
  if (!model) notFound();

  // Fall back to first option if params are missing or invalid
  const color =
    model.available_colors.find((c) => c.id === colorId) ??
    model.available_colors[0];
  const location =
    PICKUP_LOCATIONS.find((l) => l.id === locationId) ?? PICKUP_LOCATIONS[0];

  return (
    <div style={{ backgroundColor: "var(--color-surface)" }}>
      {/* Breadcrumb */}
      <div className="border-b" style={{ backgroundColor: "var(--color-canvas)", borderColor: "var(--color-border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 flex-wrap">
          <Link
            href="/catalog"
            className="font-mono text-xs transition-colors hover:text-teal-600"
            style={{ color: "var(--color-muted)" }}
          >
            ← Model Catalog
          </Link>
          <span style={{ color: "var(--color-border)" }}>/</span>
          <Link
            href={`/catalog/${model.id}`}
            className="font-mono text-xs transition-colors hover:text-teal-600"
            style={{ color: "var(--color-muted)" }}
          >
            {model.title}
          </Link>
          <span style={{ color: "var(--color-border)" }}>/</span>
          <span className="font-mono text-xs" style={{ color: "var(--color-subtle)" }}>
            Request
          </span>
        </div>
      </div>

      {/* Centred form */}
      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="mb-7">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "var(--color-teal-600)" }}>
            Step 2 of 2
          </p>
          <h1 className="font-display text-2xl font-bold" style={{ color: "var(--color-ink)" }}>
            Complete your request
          </h1>
          <p className="font-sans text-sm mt-1" style={{ color: "var(--color-muted)" }}>
            We'll contact you by phone or email when your print is ready for collection.
          </p>
        </div>

        <RequestForm
          modelId={model.id}
          modelTitle={model.title}
          basePrintMinutes={model.base_print_time_minutes}
          color={color}
          location={location}
          quantity={quantity}
        />
      </div>
    </div>
  );
}
