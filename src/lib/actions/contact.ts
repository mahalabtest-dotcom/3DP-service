"use server";

export type ContactFormState = {
  errors: Partial<Record<"name" | "email" | "subject" | "message" | "_form", string>>;
  success?: boolean;
};

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function sendContactMessage(
  _prev: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name:    (formData.get("name")    as string ?? "").trim(),
    email:   (formData.get("email")   as string ?? "").trim().toLowerCase(),
    subject: (formData.get("subject") as string ?? "").trim(),
    message: (formData.get("message") as string ?? "").trim(),
  };

  const errors: ContactFormState["errors"] = {};
  if (raw.name.length < 2)      errors.name    = "Full name is required.";
  if (!isValidEmail(raw.email)) errors.email   = "Enter a valid email address.";
  if (raw.message.length < 10)  errors.message = "Please enter a message (at least 10 characters).";
  if (Object.keys(errors).length) return { errors };

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
        subject: `Contact Form — ${raw.subject || "General Enquiry"} (${raw.name})`,
        html: `
          <p>A message was submitted via the DEWA 3D Print Service contact form.</p>
          <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
            <tr><td style="color:#6b8685;padding-right:24px">Name</td><td><strong>${raw.name}</strong></td></tr>
            <tr><td style="color:#6b8685">Email</td><td>${raw.email}</td></tr>
            ${raw.subject ? `<tr><td style="color:#6b8685">Subject</td><td>${raw.subject}</td></tr>` : ""}
            <tr><td style="color:#6b8685;vertical-align:top">Message</td><td style="white-space:pre-wrap">${raw.message}</td></tr>
          </table>
          <p style="color:#97b5b3;font-size:12px;margin-top:24px">DEWA 3D Print Service — contact form</p>
        `,
      });
    } catch (err) {
      console.error("[contact] Resend error:", err);
    }
  }

  return { errors: {}, success: true };
}
