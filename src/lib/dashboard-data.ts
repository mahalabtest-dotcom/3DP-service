import type { RequestStatus } from "@/lib/types";

export type { RequestStatus };

export type DashboardData = {
  isMock: boolean;
  stats: Record<RequestStatus, number>;
  volumeByDay: { date: string; count: number }[];
  topModels: { title: string; count: number }[];
  byStatus: { status: RequestStatus; label: string; count: number }[];
  byLocation: { name: string; count: number }[];
};

// ── Deterministic mock counts — no Math.random() ──────────────
const MOCK_DAILY = [2,5,3,7,4,6,2,0,0,3,5,8,4,6,3,7,5,4,2,6,3,5,7,4,3,5,2,4,6,3];

function buildVolumeSeries(dayMap: Record<string, number> = {}): { date: string; count: number }[] {
  const series = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const isoKey = d.toISOString().split("T")[0];
    series.push({
      date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      count: dayMap[isoKey] ?? MOCK_DAILY[29 - i],
    });
  }
  return series;
}

const MOCK: DashboardData = {
  isMock: true,
  stats: { new: 27, in_progress: 15, ready: 9, completed: 16 },
  volumeByDay: buildVolumeSeries(),
  topModels: [
    { title: "Cable Management Clip",    count: 18 },
    { title: "ID Badge Holder",          count: 14 },
    { title: "Mounting Bracket — L Type",count: 11 },
    { title: "Door Room Sign Holder",    count: 9  },
    { title: "Network Patch Cable Clip", count: 7  },
    { title: "Equipment Label Plate",    count: 6  },
    { title: "Desk Phone Stand",         count: 5  },
  ],
  byStatus: [
    { status: "new",         label: "New",         count: 27 },
    { status: "in_progress", label: "In Progress", count: 15 },
    { status: "ready",       label: "Ready",       count: 9  },
    { status: "completed",   label: "Completed",   count: 16 },
  ],
  byLocation: [
    { name: "Al Sheraa",   count: 22 },
    { name: "Hudaiba",     count: 18 },
    { name: "Al Quoz",     count: 15 },
    { name: "Al Ruwayyah", count: 12 },
  ],
};

// ── Real Supabase fetch (used when URL is configured) ──────────
export async function getDashboardData(): Promise<DashboardData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!supabaseUrl.startsWith("http")) return MOCK;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const [{ data: requests, error }, { data: models }, { data: locations }] =
      await Promise.all([
        supabase.from("requests").select("id, status, pickup_location_id, model_id, created_at"),
        supabase.from("models").select("id, title"),
        supabase.from("pickup_locations").select("id, name"),
      ]);

    if (error || !requests?.length) return MOCK;

    const modelMap  = Object.fromEntries((models    ?? []).map((m) => [m.id, m.title]));
    const locMap    = Object.fromEntries((locations ?? []).map((l) => [l.id, l.name]));

    // Stats
    const stats: Record<RequestStatus, number> = { new: 0, in_progress: 0, ready: 0, completed: 0 };
    for (const r of requests) stats[r.status as RequestStatus] = (stats[r.status as RequestStatus] ?? 0) + 1;

    // Volume
    const dayMap: Record<string, number> = {};
    for (const r of requests) {
      const key = (r.created_at as string).split("T")[0];
      dayMap[key] = (dayMap[key] ?? 0) + 1;
    }

    // Top models
    const modelCount: Record<string, number> = {};
    for (const r of requests) {
      const title = modelMap[r.model_id] ?? "Unknown";
      modelCount[title] = (modelCount[title] ?? 0) + 1;
    }
    const topModels = Object.entries(modelCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 7)
      .map(([title, count]) => ({ title, count }));

    // By location
    const locCount: Record<string, number> = {};
    for (const r of requests) {
      const name = locMap[r.pickup_location_id] ?? "Unknown";
      locCount[name] = (locCount[name] ?? 0) + 1;
    }
    const byLocation = Object.entries(locCount)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }));

    return {
      isMock: false,
      stats,
      volumeByDay: buildVolumeSeries(dayMap),
      topModels,
      byStatus: [
        { status: "new",         label: "New",         count: stats.new },
        { status: "in_progress", label: "In Progress", count: stats.in_progress },
        { status: "ready",       label: "Ready",       count: stats.ready },
        { status: "completed",   label: "Completed",   count: stats.completed },
      ],
      byLocation,
    };
  } catch (e) {
    console.error("[dashboard] data error:", e);
    return MOCK;
  }
}
