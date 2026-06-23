"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

function ChartTooltip({ active, payload }: {
  active?: boolean;
  payload?: { payload: { title: string }; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 font-sans text-xs shadow-md max-w-[200px]"
      style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
    >
      <p className="leading-snug" style={{ color: "var(--color-muted)" }}>{payload[0].payload.title}</p>
      <p className="font-semibold mt-0.5" style={{ color: "var(--color-teal-700)" }}>
        {payload[0].value} request{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

// Truncate long model names for the Y-axis labels
function truncate(s: string, max = 22) {
  return s.length > max ? s.slice(0, max) + "…" : s;
}

export default function TopModelsChart({
  data,
}: {
  data: { title: string; count: number }[];
}) {
  const chartData = data.map((d) => ({ ...d, label: truncate(d.title) }));
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
    >
      <p className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: "var(--color-subtle)" }}>
        Most requested models
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          barSize={14}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#C8DCDA" strokeOpacity={0.5} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "#97B5B3" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            domain={[0, max + 1]}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={150}
            tick={{ fontFamily: "var(--font-sans)", fontSize: 11, fill: "#6B8685" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(58,171,160,0.05)" }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((_, i) => (
              <Cell
                key={i}
                fill={i === 0 ? "#3AABA0" : i === 1 ? "#62BFB6" : "#9FD4D0"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
