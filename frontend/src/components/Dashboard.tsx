import type { User } from "@/types/user";
import type { Tool } from "@/features/tools/types";
import ToolList from "@/features/tools/components/ToolList";

type DashboardProps = {
  user: User;
  tools: Tool[];
};

export default function Dashboard({ user, tools }: DashboardProps) {
  return (
    <>
      <section className="rounded-3xl border app-border app-surface p-8 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-subtle">
              Dashboard
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-primary">
          Добре дошъл, {user.name}!
            </h2>
            <p className="mt-3 text-sm text-muted">
              Ти си с роля: <span className="font-semibold">{user.role}</span>
            </p>
          </div>
          <div className="rounded-2xl border app-border app-panel px-4 py-2 text-xs text-subtle">
            Активен профил
          </div>
        </div>
        <div className="mt-6 rounded-2xl border app-border app-panel p-4 text-sm text-muted">
          <p className="text-xs uppercase text-subtle">Потребител</p>
          <p className="mt-2 text-base font-semibold text-primary">
            ID: {user.id}
          </p>
          <p className="text-xs text-subtle">{user.email}</p>
        </div>
      </section>

      <ToolList tools={tools} title="Инструменти добавени от мен" />
    </>
  );
}
