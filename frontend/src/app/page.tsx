"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import Dashboard from "@/components/Dashboard";
import LoginForm from "@/components/LoginForm";
import Loader from "@/components/Loader";
import { useAuthSession } from "@/hooks/useAuthSession";
import { fetchTools } from "@/features/tools/services";
import type { Tool } from "@/features/tools/types";

export default function Home() {
  const [email, setEmail] = useState("ivan@admin.local");
  const [password, setPassword] = useState("password");
  const { user, status, error, isChecking, login, logout } = useAuthSession();
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    if (!user) {
      setTools([]);
      return;
    }
    fetchTools()
      .then((items) => {
        const mine = items.filter(
          (tool) =>
            tool.created_by === user.id || tool.creator?.id === user.id
        );
        setTools(mine);
      })
      .catch(() => setTools([]));
  }, [user]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#18212f,#0b0f1a_55%,#07090f)] text-slate-100">
      <AppHeader
        isAuthenticated={Boolean(user)}
        onLogout={logout}
        links={
          user
            ? [
                { label: "Начало", href: "/" },
                { label: "Инструменти", href: "/tools" },
              ]
            : []
        }
      />

      <main className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1.2fr_0.8fr]">
        {isChecking ? (
          <section className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-8 shadow-2xl shadow-black/40 lg:col-span-2">
            <Loader label="Проверка на сесията..." />
          </section>
        ) : !user ? (
          <LoginForm
            email={email}
            password={password}
            status={status}
            error={error}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={(event) => {
              event.preventDefault();
              login({ email, password });
            }}
          />
        ) : (
          <Dashboard user={user} tools={tools} />
        )}
      </main>
    </div>
  );
}
