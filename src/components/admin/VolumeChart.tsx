"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 font-sans text-xs shadow-md"
      style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
    >
      <p style={{ color: "var(--color-muted)" }}>{label}</p>
      <p className="font-semibold mt-0.5" style={{ color: "var(--color-teal-700)" }}>
        {payload[0].value} request{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default function VolumeChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
    >
      <p className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: "var(--color-subtle)" }}>
        Request volume · last 30 days
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3AABA0" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#3AABA0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#C8DCDA" strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "#97B5B3" }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "#97B5B3" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#C8DCDA", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#3AABA0"
            strokeWidth={2}
            fill="url(#tealGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#3AABA0", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
