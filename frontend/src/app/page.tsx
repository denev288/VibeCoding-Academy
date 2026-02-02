"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Dashboard from "@/components/Dashboard";
import LoginForm from "@/components/LoginForm";
import { useAuthSession } from "@/hooks/useAuthSession";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, status, error, login, logout } = useAuthSession();

  const roleActions: Record<string, string[]> = {
    owner: ["Управление на екип", "Настройки на проекта", "Отчети"],
    backend: ["API заявки", "Логове", "Документация"],
    frontend: ["UI задачи", "Компоненти", "Дизайн система"],
    pm: ["Спринтове", "Календар", "Рискове"],
    qa: ["Тестове", "Доклади", "Бъгове"],
    designer: ["Moodboard", "Файлове", "Прототипи"],
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#18212f,#0b0f1a_55%,#07090f)] text-slate-100">
      <AppHeader isAuthenticated={Boolean(user)} onLogout={logout} />

      <main className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1.2fr_0.8fr]">
        {!user ? (
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
          <Dashboard user={user} roleActions={roleActions} />
        )}
      </main>
    </div>
  );
}
