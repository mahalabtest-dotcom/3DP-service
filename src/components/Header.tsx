import Link from "next/link";

function WireframeCube() {
  return (
    <div className="cube-scene" aria-hidden="true">
      <div className="cube">
        <div className="cube-face cube-face--front" />
        <div className="cube-face cube-face--back" />
        <div className="cube-face cube-face--left" />
        <div className="cube-face cube-face--right" />
        <div className="cube-face cube-face--top" />
        <div className="cube-face cube-face--bottom" />
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <header className="bg-teal-900 text-white border-b-2 border-amber-500">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Logotype */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
          aria-label="DEWA 3D Print — home"
        >
          <div className="text-teal-300 group-hover:text-amber-400 transition-colors duration-300">
            <WireframeCube />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-700 tracking-wide text-white">
              DEWA
            </span>
            <span className="font-sans text-[10px] font-500 tracking-[0.18em] uppercase text-teal-300 group-hover:text-amber-400 transition-colors duration-300">
              3D Print Service
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <Link
            href="/catalog"
            className="px-4 py-2 rounded-md text-sm font-medium text-teal-100 hover:text-white hover:bg-teal-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Browse Catalog
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-md text-sm font-medium text-teal-100 hover:text-white hover:bg-teal-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Contact
          </Link>
          <div className="w-px h-4 bg-teal-700 mx-1" aria-hidden="true" />
          <Link
            href="/admin/login"
            className="px-4 py-2 rounded-md text-sm font-medium text-teal-400 hover:text-white hover:bg-teal-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Admin
          </Link>
        </nav>

      </div>
    </header>
  );
}
