import type { RequestStatus } from "@/lib/types";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/types";

const STATS: { status: RequestStatus; icon: string }[] = [
  { status: "new",         icon: "●" },
  { status: "in_progress", icon: "◐" },
  { status: "ready",       icon: "◉" },
  { status: "completed",   icon: "✓" },
];

export default function DashboardStats({
  stats,
}: {
  stats: Record<RequestStatus, number>;
}) {
  const total = Object.values(stats).reduce((s, n) => s + n, 0);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map(({ status, icon }) => (
        <div
          key={status}
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--color-subtle)" }}>
              {STATUS_LABELS[status]}
            </span>
            <span className="text-base" style={{ color: STATUS_COLORS[status] }} aria-hidden="true">
              {icon}
            </span>
          </div>
          <p className="font-display text-3xl font-bold" style={{ color: "var(--color-ink)" }}>
            {stats[status]}
          </p>
          {total > 0 && (
            <p className="font-mono text-[10px] mt-1" style={{ color: "var(--color-subtle)" }}>
              {Math.round((stats[status] / total) * 100)}% of total
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
