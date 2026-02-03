import type { AuditLog } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8201";

export type AuditFilters = {
  action?: string;
  user_id?: string;
  subject_type?: string;
};

export async function fetchAuditLogs(
  filters: AuditFilters = {}
): Promise<AuditLog[]> {
  const params = new URLSearchParams();
  if (filters.action) params.set("action", filters.action);
  if (filters.user_id) params.set("user_id", filters.user_id);
  if (filters.subject_type) params.set("subject_type", filters.subject_type);
  const query = params.toString();

  const res = await fetch(
    `${API_BASE}/api/admin/activity-logs${query ? `?${query}` : ""}`,
    { credentials: "include" }
  );
  if (!res.ok) return [];
  return res.json();
}
