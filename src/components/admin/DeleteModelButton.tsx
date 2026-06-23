"use client";

import { useState, useTransition } from "react";
import { deleteModel } from "@/lib/actions/admin-catalog";

export default function DeleteModelButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteModel(id);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="font-sans text-xs px-2.5 py-1.5 rounded-md transition-colors"
        style={{
          backgroundColor: isPending ? "#FEE2E2" : "transparent",
          color: "#DC2626",
          border: "1px solid #FECACA",
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? "Deleting…" : "Delete"}
      </button>
      {error && (
        <p className="font-sans text-xs mt-1 max-w-[180px]" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}
    </div>
  );
}
