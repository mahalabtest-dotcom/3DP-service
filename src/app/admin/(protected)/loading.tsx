export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page title skeleton */}
      <div>
        <div className="h-7 w-40 rounded mb-2" style={{ backgroundColor: "var(--color-border)" }} />
        <div className="h-4 w-64 rounded" style={{ backgroundColor: "var(--color-border)" }} />
      </div>

      {/* Content block skeletons */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-5 h-28"
            style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
          />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div
          className="lg:col-span-2 rounded-xl h-64"
          style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
        />
        <div
          className="rounded-xl h-64"
          style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
        />
      </div>
    </div>
  );
}
