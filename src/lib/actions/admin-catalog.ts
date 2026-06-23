"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type CatalogFormState = {
  errors?: Partial<Record<"title" | "description" | "category" | "base_print_time_minutes" | "colors" | "_form", string>>;
};

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url.startsWith("http") || !key || key.includes("your-")) return null;
  return createClient(url, key);
}

const NOT_CONFIGURED: CatalogFormState = {
  errors: { _form: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local then restart the dev server." },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function uploadFile(supabase: SupabaseClient<any, any, any>, file: File, path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("models")
    .upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  return supabase.storage.from("models").getPublicUrl(data.path).data.publicUrl;
}

function parseForm(formData: FormData) {
  return {
    title:       (formData.get("title")       as string ?? "").trim(),
    description: (formData.get("description") as string ?? "").trim(),
    category:    (formData.get("category")    as string ?? "").trim(),
    tagsRaw:     (formData.get("tags")        as string ?? "").trim(),
    printTime:   parseInt(formData.get("base_print_time_minutes") as string),
    colorIds:    formData.getAll("colors") as string[],
    glbFile:     formData.get("glb_file") as File | null,
    imageFiles:  formData.getAll("images") as File[],
  };
}

function validate(f: ReturnType<typeof parseForm>): CatalogFormState["errors"] {
  const e: NonNullable<CatalogFormState["errors"]> = {};
  if (f.title.length < 2)           e.title       = "Title is required.";
  if (f.description.length < 10)    e.description = "Description must be at least 10 characters.";
  if (!f.category)                  e.category    = "Category is required.";
  if (!f.printTime || f.printTime < 1) e.base_print_time_minutes = "Must be at least 1 minute.";
  if (f.colorIds.length === 0)      e.colors      = "Select at least one colour.";
  return Object.keys(e).length ? e : undefined;
}

export async function createModel(
  _prev: CatalogFormState | null,
  formData: FormData
): Promise<CatalogFormState> {
  const supabase = getAdminSupabase();
  if (!supabase) return NOT_CONFIGURED;

  const f = parseForm(formData);
  const errors = validate(f);
  if (errors) return { errors };

  try {
    let glbUrl: string | null = null;
    if (f.glbFile && f.glbFile.size > 0)
      glbUrl = await uploadFile(supabase, f.glbFile, `glb/${Date.now()}-${f.glbFile.name}`);

    const imageUrls: string[] = [];
    for (const img of f.imageFiles) {
      if (img.size > 0)
        imageUrls.push(await uploadFile(supabase, img, `images/${Date.now()}-${img.name}`) ?? "");
    }

    const { error } = await supabase.from("models").insert({
      title:                  f.title,
      description:            f.description,
      category:               f.category,
      tags:                   f.tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
      base_print_time_minutes:f.printTime,
      available_colors:       f.colorIds,
      glb_file_url:           glbUrl,
      images:                 imageUrls,
    });
    if (error) return { errors: { _form: `DB error: ${error.message}` } };
  } catch (e: unknown) {
    return { errors: { _form: String(e) } };
  }

  redirect("/admin/catalog");
}

export async function updateModel(
  id: string,
  _prev: CatalogFormState | null,
  formData: FormData
): Promise<CatalogFormState> {
  const supabase = getAdminSupabase();
  if (!supabase) return NOT_CONFIGURED;

  const f = parseForm(formData);
  const errors = validate(f);
  if (errors) return { errors };

  try {
    const updates: Record<string, unknown> = {
      title:                  f.title,
      description:            f.description,
      category:               f.category,
      tags:                   f.tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
      base_print_time_minutes:f.printTime,
      available_colors:       f.colorIds,
    };

    if (f.glbFile && f.glbFile.size > 0)
      updates.glb_file_url = await uploadFile(supabase, f.glbFile, `glb/${id}-${f.glbFile.name}`);

    const newImages: string[] = [];
    for (const img of f.imageFiles) {
      if (img.size > 0)
        newImages.push(await uploadFile(supabase, img, `images/${id}-${img.name}`) ?? "");
    }
    if (newImages.length > 0) updates.images = newImages;

    const { error } = await supabase.from("models").update(updates).eq("id", id);
    if (error) return { errors: { _form: `DB error: ${error.message}` } };
  } catch (e: unknown) {
    return { errors: { _form: String(e) } };
  }

  redirect("/admin/catalog");
}

export async function deleteModel(id: string): Promise<{ error?: string }> {
  const supabase = getAdminSupabase();
  if (!supabase) return { error: "Supabase not configured." };

  const { error } = await supabase.from("models").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/catalog");
  return {};
}
