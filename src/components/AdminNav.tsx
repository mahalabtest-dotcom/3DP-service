import Link from "next/link";
import { signOut } from "@/lib/admin-auth";

export default function AdminNav({ email }: { email: string }) {
  return (
    <header className="border-b" style={{ backgroundColor: "var(--color-canvas)", borderColor: "var(--color-border)" }}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="font-display font-bold text-sm" style={{ color: "var(--color-ink)" }}>
            DEWA 3D Print
          </Link>
          <span
            className="font-mono text-[10px] px-2 py-0.5 rounded"
            style={{ backgroundColor: "var(--color-teal-50)", color: "var(--color-teal-700)", border: "1px solid var(--color-teal-200)" }}
          >
            Admin
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          {[
            { href: "/admin",          label: "Dashboard" },
            { href: "/admin/catalog",  label: "Catalog"   },
            { href: "/admin/requests", label: "Requests"  },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-md font-sans text-sm transition-colors hover:bg-gray-50"
              style={{ color: "var(--color-muted)" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* User + sign out */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block font-mono text-xs" style={{ color: "var(--color-subtle)" }}>
            {email}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="font-sans text-sm px-3 py-1.5 rounded-md border transition-colors hover:bg-gray-50"
              style={{ color: "var(--color-muted)", borderColor: "var(--color-border)" }}
            >
              Sign out
            </button>
          </form>
        </div>

      </div>
    </header>
  );
}
