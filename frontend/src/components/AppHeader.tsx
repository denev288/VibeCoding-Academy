 "use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

type AppHeaderProps = {
  isAuthenticated: boolean;
  onLogout: () => void;
  links?: { label: string; href: string }[];
  userName?: string;
  userEmail?: string;
  userRole?: string;
};

export default function AppHeader({
  isAuthenticated,
  onLogout,
  links = [],
  userName,
  userEmail,
  userRole,
}: AppHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { theme, toggleTheme } = useTheme();
  const initials =
    userName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "VC";

  const roleSections: Record<string, { label: string; href: string }[]> = {
    owner: [
      { label: "Админ панел", href: "/admin" },
      { label: "Audit Logs", href: "/admin/audit" },
      { label: "Екип", href: "/team" },
      { label: "Отчети", href: "/reports" },
    ],
    backend: [
      { label: "API", href: "/api-tools" },
      { label: "Логове", href: "/logs" },
    ],
    frontend: [
      { label: "UI библиотека", href: "/ui-kit" },
      { label: "Дизайн задачи", href: "/ui-tasks" },
    ],
    pm: [
      { label: "Roadmap", href: "/roadmap" },
      { label: "Спринтове", href: "/sprints" },
    ],
    qa: [
      { label: "Тестове", href: "/tests" },
      { label: "Бъгове", href: "/bugs" },
    ],
    designer: [
      { label: "Assets", href: "/assets" },
      { label: "Прототипи", href: "/prototypes" },
    ],
  };
  const menuItems = userRole ? roleSections[userRole] ?? [] : [];

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="mx-auto w-full max-w-6xl px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
          <span className="text-sm font-bold">VC</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-subtle">
            VibeCoding
          </p>
          <h1 className="text-lg font-semibold text-primary">
            Frontend Workspace
          </h1>
        </div>
        </div>
        {isAuthenticated ? (
          <div className="relative flex items-center gap-3">
            <button
              className="rounded-full border app-border app-panel px-3 py-2 text-xs font-medium text-primary transition hover:border-slate-400"
              type="button"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <div className="relative" ref={menuRef}>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border app-border app-panel text-xs font-semibold text-primary transition hover:border-[color:var(--accent)]"
                type="button"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                onClick={() => {
                  setIsProfileOpen((prev) => !prev);
                  setIsSectionsOpen(false);
                }}
              >
                {initials}
              </button>
              {isProfileOpen ? (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl border app-border app-surface p-2 text-sm text-primary shadow-xl">
                <div className="px-3 py-2">
                  <p className="text-xs text-subtle">Профил</p>
                  <p className="text-sm font-semibold text-primary">
                    {userName ?? "Потребител"}
                  </p>
                  {userEmail ? (
                    <p className="text-xs text-subtle">{userEmail}</p>
                  ) : null}
                </div>
                <div className="my-2 h-px bg-slate-800/70" />
                <Link
                  className="block rounded-xl px-3 py-2 text-sm transition hover:bg-slate-900/20"
                  href="/profile"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Преглед на профила
                </Link>
                <button
                  className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-rose-200 transition hover:bg-rose-500/10"
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout();
                  }}
                >
                  Изход
                </button>
              </div>
            ) : null}
            </div>
          </div>
        ) : null}
      </div>
      {links.length ? (
        <nav className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted sm:mt-3">
          {links.map((link) => (
            <Link
              key={link.href}
              className="rounded-full border app-border app-panel px-4 py-2 text-xs font-medium text-primary transition hover:border-slate-500"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && menuItems.length ? (
            <>
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  className="rounded-full border app-border app-panel px-4 py-2 text-xs font-medium text-primary transition hover:border-slate-500"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
