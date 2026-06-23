"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactFormState } from "@/lib/actions/contact";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-mono text-[11px] tracking-wide" style={{ color: "var(--color-muted)" }}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="font-sans text-[11px]" style={{ color: "var(--color-subtle)" }}>{hint}</p>
      )}
      {error && (
        <p className="font-sans text-[11px]" style={{ color: "#B91C1C" }} role="alert">{error}</p>
      )}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  const { hasError, ...rest } = props;
  return (
    <input
      {...rest}
      className="w-full rounded-lg border px-3 py-2.5 font-sans text-sm outline-none transition-colors"
      style={{
        borderColor: hasError ? "#FCA5A5" : "var(--color-border)",
        backgroundColor: hasError ? "#FFF5F5" : "var(--color-canvas)",
        color: "var(--color-ink)",
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = hasError ? "#EF4444" : "var(--color-teal-500)"; props.onFocus?.(e); }}
      onBlur={(e)  => { e.currentTarget.style.borderColor = hasError ? "#FCA5A5" : "var(--color-border)"; props.onBlur?.(e); }}
    />
  );
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactFormState | null, FormData>(
    sendContactMessage,
    null
  );
  const e = state?.errors ?? {};

  if (state?.success) {
    return (
      <div
        className="rounded-2xl p-8 flex flex-col items-center text-center gap-4"
        style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--color-teal-50)", border: "2px solid var(--color-teal-400)" }}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path d="M5 13l6 6L21 7" stroke="var(--color-teal-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="font-display font-bold text-lg" style={{ color: "var(--color-ink)" }}>
            Message sent
          </p>
          <p className="font-sans text-sm mt-1" style={{ color: "var(--color-muted)" }}>
            We&apos;ve received your message and will be in touch.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <Field id="name" label="FULL NAME" error={e.name}>
        <Input
          id="name" name="name" type="text"
          autoComplete="name" required
          placeholder="e.g. Ahmed Al Mansoori"
          hasError={!!e.name}
        />
      </Field>

      <Field id="email" label="YOUR EMAIL" error={e.email}>
        <Input
          id="email" name="email" type="email"
          autoComplete="email" required
          placeholder="you@dewa.ae"
          hasError={!!e.email}
        />
      </Field>

      <Field id="subject" label="SUBJECT (OPTIONAL)" error={e.subject}>
        <Input
          id="subject" name="subject" type="text"
          placeholder="e.g. Custom model request"
        />
      </Field>

      <Field id="message" label="MESSAGE" error={e.message}>
        <textarea
          id="message" name="message" required rows={5}
          placeholder="Describe your question or request…"
          className="w-full rounded-lg border px-3 py-2.5 font-sans text-sm outline-none transition-colors resize-y"
          style={{
            borderColor: e.message ? "#FCA5A5" : "var(--color-border)",
            backgroundColor: e.message ? "#FFF5F5" : "var(--color-canvas)",
            color: "var(--color-ink)",
            minHeight: 120,
          }}
          onFocus={(ev) => { ev.currentTarget.style.borderColor = e.message ? "#EF4444" : "var(--color-teal-500)"; }}
          onBlur={(ev)  => { ev.currentTarget.style.borderColor = e.message ? "#FCA5A5" : "var(--color-border)"; }}
        />
      </Field>

      {e._form && (
        <p className="font-sans text-sm rounded-lg px-3 py-2.5" style={{ color: "#B91C1C", backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }} role="alert">
          {e._form}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 rounded-xl font-display font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        style={{ backgroundColor: "var(--color-amber-500)", color: "#1C2B2A" }}
      >
        {isPending ? (
          <>
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="24" strokeDashoffset="8" />
            </svg>
            Sending…
          </>
        ) : (
          <>
            Send message
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
