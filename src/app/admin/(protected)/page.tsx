import type { Metadata } from "next";
import { getDashboardData } from "@/lib/dashboard-data";
import DashboardStats from "@/components/admin/DashboardStats";
import VolumeChart from "@/components/admin/VolumeChart";
import StatusChart from "@/components/admin/StatusChart";
import TopModelsChart from "@/components/admin/TopModelsChart";
import LocationChart from "@/components/admin/LocationChart";

export const metadata: Metadata = { title: "Dashboard — DEWA 3D Print Admin" };

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "var(--color-ink)" }}>
            Dashboard
          </h1>
          <p className="font-sans text-sm mt-1" style={{ color: "var(--color-muted)" }}>
            {data.isMock
              ? "Sample data — connect Supabase to see live request analytics."
              : "Live request analytics."}
          </p>
        </div>
        {data.isMock && (
          <span
            className="font-mono text-[10px] px-2.5 py-1 rounded-full shrink-0 mt-1"
            style={{ backgroundColor: "var(--color-amber-50)", color: "#92400E", border: "1px solid #FDE68A" }}
          >
            Sample data
          </span>
        )}
      </div>

      {/* KPI cards */}
      <DashboardStats stats={data.stats} />

      {/* Volume + Status */}
      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        <div className="lg:col-span-2">
          <VolumeChart data={data.volumeByDay} />
        </div>
        <StatusChart data={data.byStatus} />
      </div>

      {/* Top models + Locations */}
      <div className="grid lg:grid-cols-2 gap-5 mt-5">
        <TopModelsChart data={data.topModels} />
        <LocationChart data={data.byLocation} />
      </div>
    </div>
  );
}
