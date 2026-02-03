export type AuditUser = {
  id: number;
  name?: string | null;
  email?: string | null;
};

export type AuditLog = {
  id: number;
  user_id?: number | null;
  action: string;
  subject_type?: string | null;
  subject_id?: number | null;
  metadata?: Record<string, unknown> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
  user?: AuditUser | null;
};
