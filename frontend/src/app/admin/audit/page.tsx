"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import Loader from "@/components/Loader";
import { useAuthSession } from "@/hooks/useAuthSession";
import { fetchAuditLogs } from "@/features/audit/services";
import type { AuditLog } from "@/features/audit/types";

export default function AuditPage() {
  const { user, isChecking, logout } = useAuthSession();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filters, setFilters] = useState({
    action: "",
    user_id: "",
    subject_type: "",
  });

  const loadLogs = async () => {
    const data = await fetchAuditLogs(filters);
    setLogs(data);
  };

  useEffect(() => {
    if (!user) return;
    loadLogs().catch(() => setLogs([]));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    loadLogs().catch(() => setLogs([]));
  }, [filters.action, filters.user_id, filters.subject_type, user]);

  const isOwner = user?.role === "owner";

  return (
    <div className="min-h-screen app-shell">
      <AppHeader
        isAuthenticated={Boolean(user)}
        onLogout={logout}
        userName={user?.name}
        userEmail={user?.email}
        userRole={user?.role}
        links={
          user
            ? [
                { label: "Начало", href: "/" },
                { label: "Инструменти", href: "/tools" },
                { label: "Админ панел", href: "/admin" },
              ]
            : []
        }
      />

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-4">
        {isChecking ? (
          <section className="rounded-3xl border app-border app-surface p-6">
            <Loader label="Зареждане..." />
          </section>
        ) : !isOwner ? (
          <section className="rounded-3xl border app-border app-surface p-6 text-sm text-muted">
            Нямате достъп до одит логовете.
          </section>
        ) : (
          <>
            <section className="rounded-3xl border app-border app-surface p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-primary">
                    Audit Logs
                  </h2>
                  <p className="mt-1 text-sm text-subtle">
                    История на действията в системата.
                  </p>
                </div>
                <span className="rounded-full border app-border app-panel px-3 py-1 text-xs text-subtle">
                  Общо: {logs.length}
                </span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm text-muted">
                  Действие
                  <input
                    className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary"
                    value={filters.action}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        action: event.target.value,
                      }))
                    }
                    placeholder="tool.created"
                  />
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  User ID
                  <input
                    className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary"
                    value={filters.user_id}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        user_id: event.target.value,
                      }))
                    }
                    placeholder="1"
                  />
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Subject Type
                  <input
                    className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary"
                    value={filters.subject_type}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        subject_type: event.target.value,
                      }))
                    }
                    placeholder="App\\Models\\Tool"
                  />
                </label>
              </div>
            </section>

            <section className="mt-6 grid gap-4">
              {logs.map((log) => (
                <article
                  key={log.id}
                  className="rounded-2xl border app-border app-surface p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-primary">
                        {log.action}
                      </h3>
                      <p className="mt-1 text-xs text-subtle">
                        {log.subject_type
                          ? `${log.subject_type} #${log.subject_id ?? "—"}`
                          : "—"}
                      </p>
                    </div>
                    <span className="text-xs text-subtle">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : "—"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-subtle">
                    Потребител:{" "}
                    <span className="text-primary">
                      {log.user?.name ||
                        log.user?.email ||
                        (log.user_id ? `#${log.user_id}` : "—")}
                    </span>
                  </p>
                </article>
              ))}
              {logs.length === 0 ? (
                <p className="text-sm text-subtle">Няма логове по тези филтри.</p>
              ) : null}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
