"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { RequestStatus } from "@/lib/types";

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url.startsWith("http") || !key || key.includes("your-")) return null;
  return createClient(url, key);
}

export async function updateRequestStatus(
  id: string,
  status: RequestStatus
): Promise<{ error?: string }> {
  const supabase = getAdminSupabase();
  if (!supabase) return { error: "Supabase not configured." };

  const { error } = await supabase
    .from("requests")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/requests");
  return {};
}
