export default function CatalogLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
      {/* Header band skeleton */}
      <div
        className="py-12 px-6 mb-8"
        style={{ backgroundColor: "var(--color-teal-900)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="h-3 w-32 rounded mb-4 opacity-30" style={{ backgroundColor: "#fff" }} />
          <div className="h-8 w-64 rounded mb-2 opacity-30" style={{ backgroundColor: "#fff" }} />
          <div className="h-4 w-48 rounded opacity-20" style={{ backgroundColor: "#fff" }} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        {/* Search + filter skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div
            className="h-10 flex-1 rounded-lg animate-pulse"
            style={{ backgroundColor: "var(--color-border)" }}
          />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--color-border)" }}
              />
            ))}
          </div>
        </div>

        {/* Card grid skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden animate-pulse"
              style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
            >
              <div className="h-48" style={{ backgroundColor: "var(--color-border)" }} />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded" style={{ backgroundColor: "var(--color-border)" }} />
                <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "var(--color-border)" }} />
                <div className="h-3 w-full rounded" style={{ backgroundColor: "var(--color-border)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
