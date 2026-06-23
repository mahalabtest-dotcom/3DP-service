"use client";

import { useActionState } from "react";
import { submitRequest, type RequestFormState } from "@/lib/actions/submit-request";
import { type Color, type PickupLocation, formatPrintTime } from "@/lib/mock-models";

// ── Small field wrapper ──────────────────────────────────────────
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

// ── Input shared styles ──────────────────────────────────────────
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

// ── Submit button (reads pending from useActionState) ────────────
function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3.5 rounded-xl font-display font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      style={{ backgroundColor: "var(--color-amber-500)", color: "#1C2B2A" }}
    >
      {pending ? (
        <>
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="24" strokeDashoffset="8" />
          </svg>
          Submitting…
        </>
      ) : (
        <>
          Submit request
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </>
      )}
    </button>
  );
}

// ── Main form ────────────────────────────────────────────────────
export default function RequestForm({
  modelId,
  modelTitle,
  basePrintMinutes,
  color,
  location,
  quantity,
}: {
  modelId: string;
  modelTitle: string;
  basePrintMinutes: number;
  color: Color;
  location: PickupLocation;
  quantity: number;
}) {
  const [state, formAction, isPending] = useActionState<RequestFormState | null, FormData>(
    submitRequest,
    null
  );
  const e = state?.errors ?? {};

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {/* Hidden context fields */}
      <input type="hidden" name="model_id"    value={modelId} />
      <input type="hidden" name="color_id"    value={color.id} />
      <input type="hidden" name="location_id" value={location.id} />
      <input type="hidden" name="quantity"    value={quantity} />

      {/* Honeypot — visually hidden, must stay empty */}
      <div aria-hidden="true" style={{ position: "absolute", opacity: 0, height: 0, pointerEvents: "none" }}>
        <input type="text" name="website" autoComplete="off" tabIndex={-1} />
      </div>

      {/* ── Request summary ──────────────────────────────────── */}
      <div
        className="rounded-xl p-4 flex flex-col gap-3"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--color-subtle)" }}>
          Request summary
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <p className="font-mono text-[10px] mb-0.5" style={{ color: "var(--color-subtle)" }}>MODEL</p>
            <p className="font-sans font-medium leading-snug" style={{ color: "var(--color-ink)" }}>{modelTitle}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] mb-0.5" style={{ color: "var(--color-subtle)" }}>COLOUR</p>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border shrink-0" style={{ backgroundColor: color.hex, borderColor: "var(--color-border)" }} />
              <span className="font-sans" style={{ color: "var(--color-ink)" }}>{color.name}</span>
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] mb-0.5" style={{ color: "var(--color-subtle)" }}>PICKUP</p>
            <p className="font-sans" style={{ color: "var(--color-ink)" }}>{location.name}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] mb-0.5" style={{ color: "var(--color-subtle)" }}>QTY</p>
            <p className="font-sans font-semibold" style={{ color: "var(--color-ink)" }}>{quantity}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-1 border-t" style={{ borderColor: "var(--color-border)" }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="var(--color-subtle)" strokeWidth="1.5" />
            <path d="M7 4v3.5L9.5 9" stroke="var(--color-subtle)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-[11px]" style={{ color: "var(--color-subtle)" }}>
            Est. {formatPrintTime(basePrintMinutes * quantity)}{quantity > 1 ? ` (${quantity} × ${formatPrintTime(basePrintMinutes)})` : ""}
          </span>
        </div>
      </div>

      {/* ── Personal details ─────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--color-subtle)" }}>
          Your details
        </p>

        <Field id="name" label="FULL NAME" error={e.name}>
          <Input
            id="name" name="name" type="text"
            autoComplete="name" required
            placeholder="e.g. Ahmed Al Mansoori"
            hasError={!!e.name}
          />
        </Field>

        <Field id="phone" label="WORK PHONE" hint="UAE mobile number — 050 123 4567 or +971 50 123 4567" error={e.phone}>
          <Input
            id="phone" name="phone" type="tel"
            autoComplete="tel" required
            placeholder="+971 5X XXX XXXX"
            hasError={!!e.phone}
          />
        </Field>

        <Field id="email" label="WORK EMAIL" error={e.email}>
          <Input
            id="email" name="email" type="email"
            autoComplete="email" required
            placeholder="you@dewa.ae"
            hasError={!!e.email}
          />
        </Field>

        <Field id="payroll_id" label="PAYROLL ID" hint="Your DEWA employee number" error={e.payroll_id}>
          <Input
            id="payroll_id" name="payroll_id" type="text"
            autoComplete="off" required
            placeholder="e.g. EMP-12345"
            hasError={!!e.payroll_id}
          />
        </Field>
      </div>

      {/* Form-level error */}
      {e._form && (
        <p className="font-sans text-sm rounded-lg px-3 py-2.5" style={{ color: "#B91C1C", backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }} role="alert">
          {e._form}
        </p>
      )}

      <SubmitButton pending={isPending} />

      <p className="font-mono text-[10px] text-center" style={{ color: "var(--color-subtle)" }}>
        Your details are used only to contact you about this request
      </p>
    </form>
  );
}
