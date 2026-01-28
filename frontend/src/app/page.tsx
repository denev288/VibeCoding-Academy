"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import LoginForm from "@/components/LoginForm";
import type { User } from "@/types/user";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8201";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("ivan@admin.local");
  const [password, setPassword] = useState("password");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const getCsrfCookie = async () => {
    await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
    });
  };

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
  };

  const fetchUser = async () => {
    const res = await fetch(`${API_BASE}/api/user`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      setUser(null);
      return;
    }

    const data = (await res.json()) as User;
    setUser(data);
  };

  useEffect(() => {
    fetchUser().catch(() => undefined);
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setStatus("Влизане...");

    try {
      await getCsrfCookie();
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload?.message ?? "Грешно потребителско име или парола.");
        setStatus("");
        return;
      }

      await fetchUser();
      setStatus("Успешен вход.");
      setShowLogin(false);
    } catch (err) {
      setError("Възникна проблем при вход.");
      setStatus("");
    }
  };

  const handleLogout = async () => {
    setError("");
    setStatus("Изход...");

    await fetch(`${API_BASE}/logout`, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    setUser(null);
    setStatus("Излязъл");
  };

  const roleActions: Record<string, string[]> = {
    owner: ["Управление на екип", "Настройки на проекта", "Отчети"],
    backend: ["API заявки", "Логове", "Документация"],
    frontend: ["UI задачи", "Компоненти", "Дизайн система"],
    pm: ["Спринтове", "Календар", "Рискове"],
    qa: ["Тестове", "Доклади", "Бъгове"],
    designer: ["Moodboard", "Файлове", "Прототипи"],
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#18212f,_#0b0f1a_55%,_#07090f)] text-slate-100">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
            <span className="text-sm font-bold">VC</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              VibeCoding
            </p>
            <h1 className="text-lg font-semibold text-slate-100">
              Frontend Workspace
            </h1>
          </div>
        </div>
        {user ? (
          <button
            className="rounded-full border border-emerald-400/60 px-4 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/10"
            type="button"
            onClick={handleLogout}
          >
            Изход
          </button>
        ) : null}
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1.2fr_0.8fr]">
        {!user ? (
          <LoginForm
            email={email}
            password={password}
            status={status}
            error={error}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
          />
        ) : (
          <Dashboard user={user} roleActions={roleActions} />
        )}
      </main>
    </div>
  );
}
