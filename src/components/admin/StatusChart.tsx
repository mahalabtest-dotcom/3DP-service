"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { RequestStatus } from "@/lib/types";
import { STATUS_COLORS } from "@/lib/types";

function ChartTooltip({ active, payload }: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 font-sans text-xs shadow-md"
      style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
    >
      <p style={{ color: "var(--color-muted)" }}>{payload[0].name}</p>
      <p className="font-semibold mt-0.5" style={{ color: "var(--color-ink)" }}>{payload[0].value}</p>
    </div>
  );
}

export default function StatusChart({
  data,
}: {
  data: { status: RequestStatus; label: string; count: number }[];
}) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div
      className="rounded-xl p-5 flex flex-col"
      style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
    >
      <p className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: "var(--color-subtle)" }}>
        By status
      </p>

      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1.5 mt-2">
        {data.map((entry) => (
          <div key={entry.status} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: STATUS_COLORS[entry.status] }}
              />
              <span className="font-sans text-xs" style={{ color: "var(--color-muted)" }}>
                {entry.label}
              </span>
            </div>
            <span className="font-mono text-xs font-semibold" style={{ color: "var(--color-ink)" }}>
              {entry.count}
              {total > 0 && (
                <span className="font-normal ml-1" style={{ color: "var(--color-subtle)" }}>
                  ({Math.round((entry.count / total) * 100)}%)
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
