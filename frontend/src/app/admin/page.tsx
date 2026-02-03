"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import Loader from "@/components/Loader";
import { useAuthSession } from "@/hooks/useAuthSession";
import {
  approveTool,
  fetchAdminTools,
  fetchCategories,
  fetchRoles,
  rejectTool,
} from "@/features/tools/services";
import type { Category, Tool } from "@/features/tools/types";

export default function AdminPage() {
  const { user, isChecking, logout } = useAuthSession();
  const [tools, setTools] = useState<Tool[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    role: "",
    category: "",
    status: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const loadData = async () => {
    const data = await fetchAdminTools(filters);
    setTools(data);
  };

  useEffect(() => {
    if (!user) return;
    fetchRoles().then(setRoles).catch(() => setRoles([]));
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    loadData().catch(() => setTools([]));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    loadData().catch(() => setTools([]));
  }, [filters.role, filters.category, filters.status, user]);

  const handleApprove = async (tool: Tool) => {
    setStatusMessage("Одобряване...");
    const result = await approveTool(tool.id);
    if (result.ok) {
      setStatusMessage("Инструментът е одобрен.");
      loadData().catch(() => setTools([]));
    } else {
      setStatusMessage(result.error ?? "Грешка при одобрение.");
    }
  };

  const handleReject = async (tool: Tool) => {
    setStatusMessage("Отказ...");
    const result = await rejectTool(tool.id);
    if (result.ok) {
      setStatusMessage("Инструментът е отказан.");
      loadData().catch(() => setTools([]));
    } else {
      setStatusMessage(result.error ?? "Грешка при отказ.");
    }
  };

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
            Нямате достъп до админ панела.
          </section>
        ) : (
          <>
            <section className="rounded-3xl border app-border app-surface p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-primary">
                    Админ панел
                  </h2>
                  <p className="mt-1 text-sm text-subtle">
                    Одобрявай или отказвай нови предложения.
                  </p>
                </div>
                <span className="rounded-full border app-border app-panel px-3 py-1 text-xs text-subtle">
                  Общо: {tools.length}
                </span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm text-muted">
                  Роля
                  <select
                    className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary"
                    value={filters.role}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        role: event.target.value,
                      }))
                    }
                  >
                    <option value="">Всички</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Категория
                  <select
                    className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary"
                    value={filters.category}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                  >
                    <option value="">Всички</option>
                    {categories.map((category) => (
                      <option key={category.id} value={String(category.id)}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Статус
                  <select
                    className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary"
                    value={filters.status}
                    onChange={(event) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: event.target.value,
                      }))
                    }
                  >
                    <option value="">Всички</option>
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                </label>
              </div>
            </section>

            {statusMessage ? (
              <p className="mt-4 text-sm text-subtle">{statusMessage}</p>
            ) : null}

            <section className="mt-6 grid gap-4">
              {tools.map((tool) => (
                <article
                  key={tool.id}
                  className="rounded-2xl border app-border app-surface p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-subtle">
                        Статус:{" "}
                        <span className="text-primary">
                          {tool.status ?? "unknown"}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-subtle">
                        Създадено от:{" "}
                        <span className="text-primary">
                          {tool.creator?.name ||
                            tool.creator?.email ||
                            `Потребител #${tool.created_by ?? "-"}`}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        className="rounded-full accent-border accent-soft px-3 py-2 text-xs accent-text"
                        type="button"
                        onClick={() => handleApprove(tool)}
                      >
                        Одобри
                      </button>
                      <button
                        className="rounded-full border border-rose-400/70 bg-rose-500/10 px-3 py-2 text-xs text-rose-200"
                        type="button"
                        onClick={() => handleReject(tool)}
                      >
                        Откажи
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {tools.length === 0 ? (
                <p className="text-sm text-subtle">
                  Няма инструменти по тези филтри.
                </p>
              ) : null}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
