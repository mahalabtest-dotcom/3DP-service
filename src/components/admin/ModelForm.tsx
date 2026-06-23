"use client";

import { useActionState, useRef, useState } from "react";
import type { CatalogFormState } from "@/lib/actions/admin-catalog";
import type { Color } from "@/lib/mock-models";
import { CATEGORIES } from "@/lib/mock-models";

const ALL_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

type ModelDefaults = {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  base_print_time_minutes?: number;
  available_colors?: string[];
  glb_file_url?: string | null;
  images?: string[];
};

type Props = {
  action: (state: CatalogFormState | null, data: FormData) => Promise<CatalogFormState>;
  colors: Color[];
  defaults?: ModelDefaults;
  submitLabel?: string;
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="font-sans text-xs mt-1" style={{ color: "#DC2626" }}>{msg}</p>;
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-sans text-sm font-medium mb-1.5"
      style={{ color: "var(--color-ink)" }}
    >
      {children}
    </label>
  );
}

const inputClass =
  "w-full font-sans text-sm px-3 py-2.5 rounded-lg outline-none transition-colors";
const inputStyle = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  color: "var(--color-ink)",
};
const inputFocusStyle = { border: "1px solid var(--color-teal-600)" };

function TextInput({
  id,
  name,
  defaultValue,
  placeholder,
  hasError,
}: {
  id: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  hasError?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id}
      name={name}
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={inputClass}
      style={{
        ...inputStyle,
        ...(focused || hasError ? (hasError ? { border: "1px solid #DC2626" } : inputFocusStyle) : {}),
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export default function ModelForm({ action, colors, defaults, submitLabel = "Save model" }: Props) {
  const [state, formAction, isPending] = useActionState(action, null);
  const glbRef = useRef<HTMLInputElement>(null);
  const [glbName, setGlbName] = useState<string>(defaults?.glb_file_url ? "Current file retained" : "");
  const [imgNames, setImgNames] = useState<string>("");

  const e = state?.errors ?? {};
  const activeColorIds = defaults?.available_colors ?? [];

  return (
    <form action={formAction} className="space-y-6">
      {/* Global error */}
      {e._form && (
        <div
          className="rounded-lg px-4 py-3 font-sans text-sm"
          style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}
        >
          {e._form}
        </div>
      )}

      {/* Title */}
      <div>
        <Label htmlFor="title">Title <span style={{ color: "#DC2626" }}>*</span></Label>
        <TextInput id="title" name="title" defaultValue={defaults?.title} placeholder="e.g. Cable Management Clip" hasError={!!e.title} />
        <FieldError msg={e.title} />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description <span style={{ color: "#DC2626" }}>*</span></Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaults?.description}
          placeholder="Describe what the model is for and how it's used…"
          className={inputClass}
          style={{
            ...inputStyle,
            resize: "vertical",
            ...(e.description ? { border: "1px solid #DC2626" } : {}),
          }}
        />
        <FieldError msg={e.description} />
      </div>

      {/* Category + Print time — side by side */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category <span style={{ color: "#DC2626" }}>*</span></Label>
          <select
            id="category"
            name="category"
            defaultValue={defaults?.category ?? ""}
            className={inputClass}
            style={{ ...inputStyle, ...(e.category ? { border: "1px solid #DC2626" } : {}) }}
          >
            <option value="" disabled>Select category…</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <FieldError msg={e.category} />
        </div>
        <div>
          <Label htmlFor="base_print_time_minutes">
            Print time (minutes) <span style={{ color: "#DC2626" }}>*</span>
          </Label>
          <input
            id="base_print_time_minutes"
            name="base_print_time_minutes"
            type="number"
            min={1}
            defaultValue={defaults?.base_print_time_minutes}
            placeholder="e.g. 90"
            className={inputClass}
            style={{ ...inputStyle, ...(e.base_print_time_minutes ? { border: "1px solid #DC2626" } : {}) }}
          />
          <FieldError msg={e.base_print_time_minutes} />
        </div>
      </div>

      {/* Tags */}
      <div>
        <Label htmlFor="tags">Tags</Label>
        <TextInput
          id="tags"
          name="tags"
          defaultValue={defaults?.tags?.join(", ")}
          placeholder="e.g. organiser, desk, cable — comma separated"
        />
        <p className="font-sans text-xs mt-1" style={{ color: "var(--color-muted)" }}>
          Separate tags with commas. Used for search.
        </p>
      </div>

      {/* Colors */}
      <div>
        <Label htmlFor="colors-group">
          Available colours <span style={{ color: "#DC2626" }}>*</span>
        </Label>
        <div
          id="colors-group"
          className="flex flex-wrap gap-3 mt-1 p-3 rounded-lg"
          style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          {colors.map((color) => {
            const checked = activeColorIds.includes(color.id);
            return (
              <label
                key={color.id}
                className="flex items-center gap-2 cursor-pointer font-sans text-sm select-none"
                style={{ color: "var(--color-ink)" }}
              >
                <input
                  type="checkbox"
                  name="colors"
                  value={color.id}
                  defaultChecked={checked}
                  className="sr-only"
                />
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{
                    backgroundColor: color.hex,
                    border: color.hex === "#F5F5F5" ? "1px solid #D1D5DB" : "none",
                  }}
                />
                {color.name}
              </label>
            );
          })}
        </div>
        <FieldError msg={e.colors} />
      </div>

      {/* GLB file */}
      <div>
        <Label htmlFor="glb_file">GLB file (3D model)</Label>
        <div
          className="rounded-lg p-4 flex items-center gap-4"
          style={{ backgroundColor: "var(--color-surface)", border: "1px dashed var(--color-border)" }}
        >
          <button
            type="button"
            onClick={() => glbRef.current?.click()}
            className="font-sans text-sm px-3 py-1.5 rounded-md shrink-0 transition-colors"
            style={{
              backgroundColor: "var(--color-teal-50)",
              color: "var(--color-teal-700)",
              border: "1px solid var(--color-teal-200)",
            }}
          >
            Choose .glb file
          </button>
          <span className="font-sans text-sm truncate" style={{ color: "var(--color-muted)" }}>
            {glbName || "No file chosen"}
          </span>
          <input
            ref={glbRef}
            id="glb_file"
            name="glb_file"
            type="file"
            accept=".glb"
            className="sr-only"
            onChange={(ev) => setGlbName(ev.target.files?.[0]?.name ?? "")}
          />
        </div>
        <p className="font-sans text-xs mt-1" style={{ color: "var(--color-muted)" }}>
          Only .glb format. Shown in the 3D viewer on the product page.
          {defaults?.glb_file_url && " Leave empty to keep the current file."}
        </p>
      </div>

      {/* Images */}
      <div>
        <Label htmlFor="images">Images</Label>
        <div
          className="rounded-lg p-4 flex items-center gap-4"
          style={{ backgroundColor: "var(--color-surface)", border: "1px dashed var(--color-border)" }}
        >
          <label
            htmlFor="images"
            className="font-sans text-sm px-3 py-1.5 rounded-md shrink-0 cursor-pointer transition-colors"
            style={{
              backgroundColor: "var(--color-teal-50)",
              color: "var(--color-teal-700)",
              border: "1px solid var(--color-teal-200)",
            }}
          >
            Choose images
          </label>
          <span className="font-sans text-sm truncate" style={{ color: "var(--color-muted)" }}>
            {imgNames || (defaults?.images?.length ? `${defaults.images.length} existing image(s)` : "No files chosen")}
          </span>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(ev) => {
              const files = Array.from(ev.target.files ?? []);
              setImgNames(files.length ? files.map((f) => f.name).join(", ") : "");
            }}
          />
        </div>
        <p className="font-sans text-xs mt-1" style={{ color: "var(--color-muted)" }}>
          JPEG or PNG. Multiple allowed.
          {defaults?.images?.length ? " Uploading new images will replace the existing ones." : ""}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="font-sans text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity"
          style={{
            backgroundColor: "var(--color-teal-700)",
            color: "#fff",
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        <a
          href="/admin/catalog"
          className="font-sans text-sm transition-colors"
          style={{ color: "var(--color-muted)" }}
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
