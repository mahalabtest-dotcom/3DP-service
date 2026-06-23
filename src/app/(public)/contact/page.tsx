import type { Metadata } from "next";
import ContactForm from "@/components/catalog/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — DEWA 3D Print Service",
  description: "Have a question or a request not in the catalog? Send us a message.",
};

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: "var(--color-surface)" }}>
      {/* Page header */}
      <div
        className="border-b"
        style={{ backgroundColor: "var(--color-canvas)", borderColor: "var(--color-border)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--color-teal-600)" }}>
            Get in touch
          </p>
          <h1 className="font-display text-3xl font-bold mb-2" style={{ color: "var(--color-ink)" }}>
            Contact Us
          </h1>
          <p className="font-sans text-sm" style={{ color: "var(--color-muted)", maxWidth: 520 }}>
            Have a question about the 3D print service, or need something not in the catalog?
            Send us a message and we&apos;ll get back to you.
          </p>
        </div>
      </div>

      {/* Two-column layout: form + info panel */}
      <div className="max-w-4xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr_300px] gap-10 items-start">
        <ContactForm />

        {/* Info panel */}
        <aside className="flex flex-col gap-4">
          <div
            className="rounded-xl p-5 flex flex-col gap-4"
            style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
          >
            <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--color-subtle)" }}>
              What you can ask about
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { icon: "📦", text: "Custom model requests not in the catalog" },
                { icon: "🎨", text: "Colour or material questions" },
                { icon: "📍", text: "Pickup location queries" },
                { icon: "⏱", text: "Estimated print time for larger orders" },
                { icon: "❓", text: "General questions about the service" },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="text-base leading-snug" aria-hidden="true">{icon}</span>
                  <span className="font-sans text-sm leading-snug" style={{ color: "var(--color-muted)" }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-xl px-5 py-4"
            style={{ backgroundColor: "var(--color-teal-50)", border: "1px solid var(--color-teal-200)" }}
          >
            <p className="font-mono text-[10px] mb-1" style={{ color: "var(--color-teal-700)" }}>
              RESPONSE TIME
            </p>
            <p className="font-sans text-sm" style={{ color: "var(--color-teal-800)" }}>
              We typically respond within 1–2 business days.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
