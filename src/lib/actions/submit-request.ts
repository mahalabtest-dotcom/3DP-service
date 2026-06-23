"use server";

import { redirect } from "next/navigation";
import { MODELS, PICKUP_LOCATIONS } from "@/lib/mock-models";

export type RequestFormState = {
  errors: Partial<Record<"name" | "phone" | "email" | "payroll_id" | "_form", string>>;
};

// ── Validation helpers ──────────────────────────────────────────
function isValidPhone(v: string) {
  // UAE mobile: 050/052/054/055/056/058 or +971 5x or 00971 5x
  return /^(\+971|00971|0)5[0-9]{8}$/.test(v.replace(/[\s-]/g, ""));
}
function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// ── Server action ───────────────────────────────────────────────
export async function submitRequest(
  _prev: RequestFormState | null,
  formData: FormData
): Promise<RequestFormState> {
  // Honeypot — bots fill the hidden "website" field; real users don't
  if (formData.get("website")) {
    redirect("/confirmed");
  }

  const raw = {
    name:       (formData.get("name")       as string ?? "").trim(),
    phone:      (formData.get("phone")      as string ?? "").trim(),
    email:      (formData.get("email")      as string ?? "").trim().toLowerCase(),
    payroll_id: (formData.get("payroll_id") as string ?? "").trim(),
    model_id:   (formData.get("model_id")   as string ?? ""),
    color_id:   (formData.get("color_id")   as string ?? ""),
    location_id:(formData.get("location_id")as string ?? ""),
  };
  const quantity = Math.min(10, Math.max(1, parseInt(formData.get("quantity") as string ?? "1", 10) || 1));

  // Validation
  const errors: RequestFormState["errors"] = {};
  if (raw.name.length < 2)        errors.name       = "Full name is required.";
  if (!isValidPhone(raw.phone))   errors.phone      = "Enter a valid UAE mobile number (e.g. 050 123 4567).";
  if (!isValidEmail(raw.email))   errors.email      = "Enter a valid email address.";
  if (raw.payroll_id.length < 2)  errors.payroll_id = "Payroll ID is required.";
  if (Object.keys(errors).length) return { errors };

  // Look up display names for the notification email
  const model    = MODELS.find((m) => m.id === raw.model_id);
  const color    = model?.available_colors.find((c) => c.id === raw.color_id);
  const location = PICKUP_LOCATIONS.find((l) => l.id === raw.location_id);

  // ── Supabase insert (skipped when URL is the placeholder) ──
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (supabaseUrl.startsWith("http")) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { error } = await supabase.from("requests").insert({
        model_id:          raw.model_id,
        color_id:          raw.color_id,
        pickup_location_id: raw.location_id,
        customer_name:     raw.name,
        phone:             raw.phone,
        email:             raw.email,
        payroll_id:        raw.payroll_id,
        status:            "new",
        estimated_print_time: model ? model.base_print_time_minutes * quantity : null,
      });
      if (error) console.error("[submit-request] DB error:", error.message);
    } catch (e) {
      console.error("[submit-request] Supabase unavailable:", e);
    }
  }

  // ── Resend notification (skipped when key is placeholder) ──
  const resendKey  = process.env.RESEND_API_KEY  ?? "";
  const resendFrom = process.env.RESEND_FROM     ?? "onboarding@resend.dev";
  const notifyTo   = process.env.ADMIN_EMAIL     ?? "";

  if (resendKey && resendKey !== "your-resend-api-key-here" && notifyTo) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from:    `DEWA 3D Print <${resendFrom}>`,
        to:      notifyTo,
        subject: `New 3D Print Request — ${model?.title ?? raw.model_id}`,
        html: `
          <p>A new print request was submitted via the DEWA 3D Print Service portal.</p>
          <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
            <tr><td style="color:#6b8685;padding-right:24px">Model</td><td><strong>${model?.title ?? raw.model_id}</strong></td></tr>
            <tr><td style="color:#6b8685">Colour</td><td>${color?.name ?? raw.color_id}</td></tr>
            <tr><td style="color:#6b8685">Pickup location</td><td>${location?.name ?? raw.location_id}</td></tr>
            <tr><td style="color:#6b8685">Quantity</td><td><strong>${quantity}</strong></td></tr>
            <tr><td style="color:#6b8685">Customer name</td><td>${raw.name}</td></tr>
            <tr><td style="color:#6b8685">Phone</td><td>${raw.phone}</td></tr>
            <tr><td style="color:#6b8685">Email</td><td>${raw.email}</td></tr>
            <tr><td style="color:#6b8685">Payroll ID</td><td>${raw.payroll_id}</td></tr>
            <tr><td style="color:#6b8685">Est. print time</td><td>${model ? `${model.base_print_time_minutes} min` : "—"}</td></tr>
          </table>
          <p style="color:#97b5b3;font-size:12px;margin-top:24px">DEWA 3D Print Service — internal use only</p>
        `,
      });
    } catch (e) {
      console.error("[submit-request] Resend error:", e);
    }
  }

  const params = new URLSearchParams({
    model:  model?.title   ?? "",
    pickup: location?.name ?? "",
    color:  color?.name    ?? "",
  });
  redirect(`/confirmed?${params.toString()}`);
}
