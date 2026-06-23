"use client";

import { Fragment, useState, useTransition } from "react";
import { updateRequestStatus } from "@/lib/actions/admin-requests";
import type { AdminRequest } from "@/lib/mock-requests";
import type { RequestStatus } from "@/lib/types";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/types";

const ALL_STATUSES: RequestStatus[] = ["new", "in_progress", "ready", "completed"];

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const color = STATUS_COLORS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}33` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {STATUS_LABELS[status]}
    </span>
  );
}

function StatusSelect({
  requestId,
  currentStatus,
  isMock,
}: {
  requestId: string;
  currentStatus: RequestStatus;
  isMock: boolean;
}) {
  const [status, setStatus] = useState<RequestStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(next: RequestStatus) {
    if (next === status || isMock) return;
    setStatus(next);
    setError(null);
    startTransition(async () => {
      const result = await updateRequestStatus(requestId, next);
      if (result.error) {
        setStatus(currentStatus);
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <select
        value={status}
        disabled={isPending || isMock}
        onChange={(e) => handleChange(e.target.value as RequestStatus)}
        className="font-sans text-xs px-2 py-1.5 rounded-md outline-none"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          color: "var(--color-ink)",
          opacity: isMock || isPending ? 0.5 : 1,
          cursor: isMock ? "not-allowed" : "pointer",
        }}
        title={isMock ? "Connect Supabase to update status" : undefined}
      >
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>
      {error && <p className="font-sans text-[10px] mt-1" style={{ color: "#DC2626" }}>{error}</p>}
    </div>
  );
}

function ContactChip({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--color-subtle)" }}>
        {label}
      </span>
      <p className="font-sans text-xs mt-0.5" style={{ color: "var(--color-ink)" }}>{value}</p>
    </div>
  );
}

export default function RequestsTable({
  requests: initial,
  isMock,
}: {
  requests: AdminRequest[];
  isMock: boolean;
}) {
  const [filter, setFilter] = useState<RequestStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = filter === "all" ? initial : initial.filter((r) => r.status === filter);

  const counts = ALL_STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: initial.filter((r) => r.status === s).length }),
    {} as Record<RequestStatus, number>
  );

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFilter("all")}
          className="font-sans text-xs px-3 py-1.5 rounded-full transition-colors"
          style={{
            backgroundColor: filter === "all" ? "var(--color-teal-700)" : "var(--color-surface)",
            color: filter === "all" ? "#fff" : "var(--color-muted)",
            border: `1px solid ${filter === "all" ? "var(--color-teal-700)" : "var(--color-border)"}`,
          }}
        >
          All ({initial.length})
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="font-sans text-xs px-3 py-1.5 rounded-full transition-colors"
            style={{
              backgroundColor: filter === s ? STATUS_COLORS[s] : "var(--color-surface)",
              color: filter === s ? "#fff" : "var(--color-muted)",
              border: `1px solid ${filter === s ? STATUS_COLORS[s] : "var(--color-border)"}`,
            }}
          >
            {STATUS_LABELS[s]} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface)" }}>
              {["Customer", "Model", "Colour · Pickup", "Status", "Update status", ""].map((h) => (
                <th
                  key={h}
                  className="font-mono text-[10px] tracking-widest uppercase px-4 py-3 whitespace-nowrap"
                  style={{ color: "var(--color-subtle)", borderBottom: "1px solid var(--color-border)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((req, i) => (
              <Fragment key={req.id}>
                <tr
                  style={{
                    backgroundColor: i % 2 === 0 ? "var(--color-canvas)" : "var(--color-surface)",
                    borderBottom: "1px solid var(--color-border)",
                    cursor: "pointer",
                  }}
                  onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                >
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm font-medium" style={{ color: "var(--color-ink)" }}>
                      {req.customer_name}
                    </p>
                    <p className="font-mono text-[10px]" style={{ color: "var(--color-subtle)" }}>
                      {req.payroll_id} · {formatDate(req.created_at)}
                    </p>
                  </td>
                  <td className="px-4 py-3 max-w-[180px]">
                    <p className="font-sans text-sm truncate" style={{ color: "var(--color-ink)" }}>
                      {req.model_title}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor: req.color_hex,
                          border: req.color_hex === "#F5F5F5" ? "1px solid #D1D5DB" : "none",
                        }}
                      />
                      <span className="font-sans text-sm" style={{ color: "var(--color-muted)" }}>
                        {req.color_name}
                      </span>
                    </div>
                    <p className="font-sans text-xs mt-0.5" style={{ color: "var(--color-subtle)" }}>
                      {req.pickup_name}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <StatusSelect requestId={req.id} currentStatus={req.status} isMock={isMock} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-sans text-xs" style={{ color: "var(--color-subtle)" }}>
                      {expanded === req.id ? "▲" : "▼"}
                    </span>
                  </td>
                </tr>

                {/* Expanded contact details */}
                {expanded === req.id && (
                  <tr
                    style={{ backgroundColor: "var(--color-teal-50)" }}
                  >
                    <td colSpan={6} className="px-4 py-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <ContactChip label="Phone" value={req.phone} />
                        <ContactChip label="Email" value={req.email} />
                        <ContactChip label="Payroll ID" value={req.payroll_id} />
                        <ContactChip
                          label="Est. print time"
                          value={
                            req.estimated_print_time < 60
                              ? `${req.estimated_print_time} min`
                              : `${Math.floor(req.estimated_print_time / 60)} hr ${req.estimated_print_time % 60 > 0 ? req.estimated_print_time % 60 + " min" : ""}`
                          }
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>

        {visible.length === 0 && (
          <div className="py-16 text-center" style={{ backgroundColor: "var(--color-canvas)" }}>
            <p className="font-sans text-sm" style={{ color: "var(--color-muted)" }}>
              No {filter !== "all" ? STATUS_LABELS[filter as RequestStatus].toLowerCase() + " " : ""}requests.
            </p>
          </div>
        )}
      </div>

      {isMock && (
        <p className="font-sans text-xs text-center mt-4" style={{ color: "var(--color-subtle)" }}>
          Sample data — status updates are disabled until Supabase is connected.
        </p>
      )}
    </div>
  );
}
