import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MODELS, COLORS } from "@/lib/mock-models";
import { updateModel } from "@/lib/actions/admin-catalog";
import ModelForm from "@/components/admin/ModelForm";

export const metadata: Metadata = { title: "Edit Model — DEWA 3D Print Admin" };

async function getModel(id: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!url.startsWith("http")) {
    const m = MODELS.find((m) => m.id === id);
    if (!m) return null;
    return {
      ...m,
      available_colors: m.available_colors.map((c) => c.id),
    };
  }
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.from("models").select("*").eq("id", id).single();
    return data ?? null;
  } catch {
    return null;
  }
}

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

export default async function EditModelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [model, colors] = await Promise.all([getModel(id), getColors()]);
  if (!model) notFound();

  // Bind the id so the form calls updateModel(id, prevState, formData)
  const boundAction = updateModel.bind(null, id);

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-sans text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        <Link href="/admin/catalog" style={{ color: "var(--color-teal-700)" }}>Catalog</Link>
        <span>›</span>
        <span className="truncate max-w-[200px]">{model.title}</span>
        <span>›</span>
        <span>Edit</span>
      </nav>

      <h1 className="font-display font-bold text-2xl mb-8" style={{ color: "var(--color-ink)" }}>
        Edit model
      </h1>

      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
      >
        <ModelForm
          action={boundAction}
          colors={colors}
          defaults={{
            title: model.title,
            description: model.description,
            category: model.category,
            tags: model.tags ?? [],
            base_print_time_minutes: model.base_print_time_minutes,
            available_colors: model.available_colors as string[],
            glb_file_url: model.glb_file_url,
            images: model.images ?? [],
          }}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
