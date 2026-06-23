"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
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

const LOCATION_COLORS = ["#3AABA0", "#22968C", "#62BFB6", "#9FD4D0"];

export default function LocationChart({
  data,
}: {
  data: { name: string; count: number }[];
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "var(--color-canvas)", border: "1px solid var(--color-border)" }}
    >
      <p className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: "var(--color-subtle)" }}>
        Requests by pickup location
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          barSize={32}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#C8DCDA" strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontFamily: "var(--font-sans)", fontSize: 11, fill: "#6B8685" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "#97B5B3" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(58,171,160,0.05)" }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={LOCATION_COLORS[i % LOCATION_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
