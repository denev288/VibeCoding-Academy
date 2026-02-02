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
      <section className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-8 shadow-2xl shadow-black/40">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
          Dashboard
        </p>
        <h2 className="mt-4 text-3xl font-semibold">
          Добре дошъл, {user.name}!
        </h2>
        <p className="mt-3 text-sm text-slate-300">
          Ти си с роля: <span className="font-semibold">{user.role}</span>
        </p>
        <div className="mt-6 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-300">
          <p className="text-xs uppercase text-slate-500">Потребител</p>
          <p className="mt-2 text-base font-semibold text-slate-100">
            ID: {user.id}
          </p>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
      </section>

      <ToolList tools={tools} title="Инструменти добавени от мен" />
    </>
  );
}
