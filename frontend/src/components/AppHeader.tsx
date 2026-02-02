import Link from "next/link";

type AppHeaderProps = {
  isAuthenticated: boolean;
  onLogout: () => void;
  links?: { label: string; href: string }[];
};

export default function AppHeader({
  isAuthenticated,
  onLogout,
  links = [],
}: AppHeaderProps) {
  return (
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
        {links.length ? (
          <nav className="ml-6 hidden items-center gap-4 text-sm text-slate-300 sm:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                className="transition hover:text-slate-100"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
      {isAuthenticated ? (
        <button
          className="rounded-full border border-emerald-400/60 px-4 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/10"
          type="button"
          onClick={onLogout}
        >
          Изход
        </button>
      ) : null}
    </header>
  );
}
