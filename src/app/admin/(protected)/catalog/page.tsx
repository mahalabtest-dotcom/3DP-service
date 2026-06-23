import type { Metadata } from "next";
import Link from "next/link";
import { MODELS, COLORS, formatPrintTime } from "@/lib/mock-models";
import DeleteModelButton from "@/components/admin/DeleteModelButton";

export const metadata: Metadata = { title: "Catalog — DEWA 3D Print Admin" };

type ModelRow = {
  id: string;
  title: string;
  category: string;
  base_print_time_minutes: number;
  color_count: number;
  glb_file_url: string | null;
};

async function getModels(): Promise<{ rows: ModelRow[]; isMock: boolean }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!url.startsWith("http")) {
    return {
      rows: MODELS.map((m) => ({
        id: m.id,
        title: m.title,
        category: m.category,
        base_print_time_minutes: m.base_print_time_minutes,
        color_count: m.available_colors.length,
        glb_file_url: m.glb_file_url,
      })),
      isMock: true,
    };
  }
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("models")
      .select("id, title, category, base_print_time_minutes, available_colors, glb_file_url")
      .order("created_at", { ascending: false });

    if (error || !data) throw new Error();
    return {
      rows: data.map((m: Record<string, unknown>) => ({
        id: m.id as string,
        title: m.title as string,
        category: m.category as string,
        base_print_time_minutes: m.base_print_time_minutes as number,
        color_count: Array.isArray(m.available_colors) ? m.available_colors.length : 0,
        glb_file_url: m.glb_file_url as string | null,
      })),
      isMock: false,
    };
  } catch {
    return {
      rows: MODELS.map((m) => ({
        id: m.id,
        title: m.title,
        category: m.category,
        base_print_time_minutes: m.base_print_time_minutes,
        color_count: m.available_colors.length,
        glb_file_url: m.glb_file_url,
      })),
      isMock: true,
    };
  }
}

export default async function AdminCatalogPage() {
  const { rows, isMock } = await getModels();

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "var(--color-ink)" }}>
            Catalog
          </h1>
          <p className="font-sans text-sm mt-1" style={{ color: "var(--color-muted)" }}>
            {rows.length} model{rows.length !== 1 ? "s" : ""}
            {isMock ? " — sample data, connect Supabase to manage the live catalog" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isMock && (
            <span
              className="font-mono text-[10px] px-2.5 py-1 rounded-full shrink-0"
              style={{ backgroundColor: "var(--color-amber-50)", color: "#92400E", border: "1px solid #FDE68A" }}
            >
              Sample data
            </span>
          )}
          <Link
            href="/admin/catalog/new"
            className="font-sans text-sm font-medium px-4 py-2 rounded-lg transition-opacity"
            style={{ backgroundColor: "var(--color-teal-700)", color: "#fff" }}
          >
            + Add model
          </Link>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--color-border)" }}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface)" }}>
              {["Model", "Category", "Print time", "Colours", "3D file", ""].map((h) => (
                <th
                  key={h}
                  className="font-mono text-[10px] tracking-widest uppercase px-4 py-3"
                  style={{ color: "var(--color-subtle)", borderBottom: "1px solid var(--color-border)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((model, i) => (
              <tr
                key={model.id}
                style={{
                  backgroundColor: i % 2 === 0 ? "var(--color-canvas)" : "var(--color-surface)",
                  borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <td className="px-4 py-3">
                  <span className="font-sans text-sm font-medium" style={{ color: "var(--color-ink)" }}>
                    {model.title}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--color-teal-50)",
                      color: "var(--color-teal-700)",
                      border: "1px solid var(--color-teal-100)",
                    }}
                  >
                    {model.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-sans text-sm" style={{ color: "var(--color-muted)" }}>
                    {formatPrintTime(model.base_print_time_minutes)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {COLORS.slice(0, model.color_count).map((c) => (
                      <span
                        key={c.id}
                        className="w-4 h-4 rounded-full"
                        title={c.name}
                        style={{
                          backgroundColor: c.hex,
                          border: c.hex === "#F5F5F5" ? "1px solid #D1D5DB" : "none",
                        }}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {model.glb_file_url ? (
                    <span
                      className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#DCFCE7", color: "#166534", border: "1px solid #BBF7D0" }}
                    >
                      ✓ GLB
                    </span>
                  ) : (
                    <span
                      className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "var(--color-surface)", color: "var(--color-subtle)", border: "1px solid var(--color-border)" }}
                    >
                      No file
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/catalog/${model.id}/edit`}
                      className="font-sans text-xs px-2.5 py-1.5 rounded-md transition-colors"
                      style={{
                        backgroundColor: "var(--color-teal-50)",
                        color: "var(--color-teal-700)",
                        border: "1px solid var(--color-teal-100)",
                      }}
                    >
                      Edit
                    </Link>
                    {!isMock && <DeleteModelButton id={model.id} title={model.title} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="py-16 text-center" style={{ backgroundColor: "var(--color-canvas)" }}>
            <p className="font-sans text-sm" style={{ color: "var(--color-muted)" }}>
              No models yet.{" "}
              <Link href="/admin/catalog/new" style={{ color: "var(--color-teal-700)" }}>
                Add the first one.
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
