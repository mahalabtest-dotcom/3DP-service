import type { Metadata } from "next";
import Link from "next/link";
import { COLORS } from "@/lib/mock-models";
import { createModel } from "@/lib/actions/admin-catalog";
import ModelForm from "@/components/admin/ModelForm";

export const metadata: Metadata = { title: "Add Model — DEWA 3D Print Admin" };

async function getColors() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!url.startsWith("http")) return COLORS;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.from("colors").select("id, name, hex").order("name");
    return data && data.length > 0 ? data : COLORS;
  } catch {
    return COLORS;
  }
}

export default async function NewModelPage() {
  const colors = await getColors();

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-sans text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        <Link href="/admin/catalog" style={{ color: "var(--color-teal-700)" }}>Catalog</Link>
        <span>›</span>
        <span>Add model</span>
      </nav>

      <h1 className="font-display font-bold text-2xl mb-8" style={{ color: "var(--color-ink)" }}>
        Add model
      </h1>

      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
      >
        <ModelForm action={createModel} colors={colors} submitLabel="Add model" />
      </div>
    </div>
  );
}
