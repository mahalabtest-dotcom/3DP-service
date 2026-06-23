export type RequestStatus = "new" | "in_progress" | "ready" | "completed";

export const STATUS_LABELS: Record<RequestStatus, string> = {
  new:         "New",
  in_progress: "In Progress",
  ready:       "Ready",
  completed:   "Completed",
};

export const STATUS_COLORS: Record<RequestStatus, string> = {
  new:         "#3AABA0", // teal-400
  in_progress: "#F59E0B", // amber-500
  ready:       "#155F59", // teal-700
  completed:   "#6B8685", // muted
};
