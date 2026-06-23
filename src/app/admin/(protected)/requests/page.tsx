import type { Metadata } from "next";
import { MOCK_REQUESTS } from "@/lib/mock-requests";
import type { AdminRequest } from "@/lib/mock-requests";
import RequestsTable from "@/components/admin/RequestsTable";

export const metadata: Metadata = { title: "Requests — DEWA 3D Print Admin" };

async function getRequests(): Promise<{ requests: AdminRequest[]; isMock: boolean }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!url.startsWith("http")) return { requests: MOCK_REQUESTS, isMock: true };

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("requests")
      .select(`
        id, customer_name, phone, email, payroll_id,
        status, estimated_print_time, created_at,
        models ( title ),
        colors ( name, hex ),
        pickup_locations ( name )
      `)
      .order("created_at", { ascending: false });

    if (error || !data) throw new Error();

    const requests: AdminRequest[] = (data as Record<string, unknown>[]).map((r) => ({
      id: r.id as string,
      model_id: "",
      model_title: (r.models as Record<string, string> | null)?.title ?? "Unknown model",
      color_name: (r.colors as Record<string, string> | null)?.name ?? "Unknown",
      color_hex: (r.colors as Record<string, string> | null)?.hex ?? "#9CA3AF",
      pickup_name: (r.pickup_locations as Record<string, string> | null)?.name ?? "Unknown",
      customer_name: r.customer_name as string,
      phone: r.phone as string,
      email: r.email as string,
      payroll_id: r.payroll_id as string,
      status: r.status as AdminRequest["status"],
      estimated_print_time: r.estimated_print_time as number,
      created_at: r.created_at as string,
    }));

    return { requests, isMock: false };
  } catch {
    return { requests: MOCK_REQUESTS, isMock: true };
  }
}

export default async function AdminRequestsPage() {
  const { requests, isMock } = await getRequests();

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "var(--color-ink)" }}>
            Requests
          </h1>
          <p className="font-sans text-sm mt-1" style={{ color: "var(--color-muted)" }}>
            {requests.length} total
            {isMock ? " — sample data, connect Supabase to see live requests" : ""}
          </p>
        </div>
        {isMock && (
          <span
            className="font-mono text-[10px] px-2.5 py-1 rounded-full shrink-0 mt-1"
            style={{ backgroundColor: "var(--color-amber-50)", color: "#92400E", border: "1px solid #FDE68A" }}
          >
            Sample data
          </span>
        )}
      </div>

      <RequestsTable requests={requests} isMock={isMock} />
    </div>
  );
}
