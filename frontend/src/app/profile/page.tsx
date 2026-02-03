"use client";

import AppHeader from "@/components/AppHeader";
import Loader from "@/components/Loader";
import { useAuthSession } from "@/hooks/useAuthSession";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isChecking, logout } = useAuthSession();

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

      <main className="mx-auto w-full max-w-4xl px-6 pb-16 pt-4">
        {isChecking ? (
          <section className="rounded-3xl border app-border app-surface p-8">
            <Loader label="Зареждане на профила..." />
          </section>
        ) : !user ? (
          <section className="rounded-3xl border app-border app-surface p-8 text-sm text-muted">
            <p>Нужен е вход, за да видиш профила си.</p>
            <Link className="mt-4 inline-flex accent-text" href="/">
              Към вход
            </Link>
          </section>
        ) : (
          <section className="rounded-3xl border app-border app-surface p-8 shadow-2xl shadow-black/40">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border app-border app-panel text-2xl font-semibold text-primary">
                {user.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-subtle">
                  Профил
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-primary">{user.name}</h2>
                <p className="mt-2 text-sm text-muted">{user.email}</p>
                {user.role ? (
                  <p className="mt-1 text-xs text-subtle">
                    Роля: <span className="text-primary">{user.role}</span>
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border app-border app-panel p-4">
                <p className="text-xs uppercase text-subtle">ID</p>
                <p className="mt-2 text-lg font-semibold text-primary">
                  #{user.id}
                </p>
              </div>
              <div className="rounded-2xl border app-border app-panel p-4">
                <p className="text-xs uppercase text-subtle">Статус</p>
                <p className="mt-2 text-lg font-semibold accent-text">
                  Активен
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
