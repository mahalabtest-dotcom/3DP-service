import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-teal-900 text-teal-400 border-t border-teal-800">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <p>
          &copy; {new Date().getFullYear()} Dubai Electricity and Water Authority.
          Internal use only.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="text-teal-500 hover:text-teal-300 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
          >
            Contact us
          </Link>
          <span className="text-teal-700">·</span>
          <span className="text-teal-600">3D Print Service &mdash; v1</span>
        </div>
      </div>
    </footer>
  );
}
