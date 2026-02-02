import type { Category } from "../types";

type ToolFiltersProps = {
  name: string;
  role: string;
  category: string;
  tags: string;
  roles: string[];
  categories: Category[];
  onChange: (field: "name" | "role" | "category" | "tags", value: string) => void;
  onApply: () => void;
};

export default function ToolFilters({
  name,
  role,
  category,
  tags,
  roles,
  categories,
  onChange,
  onApply,
}: ToolFiltersProps) {
  return (
    <section className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-6">
      <h3 className="text-lg font-semibold">Филтри</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          Име
          <input
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
            value={name}
            onChange={(event) => onChange("name", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Роля
          <select
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
            value={role}
            onChange={(event) => onChange("role", event.target.value)}
          >
            <option value="">Всички</option>
            {roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Категория
          <select
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
            value={category}
            onChange={(event) => onChange("category", event.target.value)}
          >
            <option value="">Всички</option>
            {categories.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Тагове (id или slug, разделени със запетая)
          <input
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
            value={tags}
            onChange={(event) => onChange("tags", event.target.value)}
          />
        </label>
      </div>
      <button
        className="mt-4 rounded-full border border-slate-700/70 bg-slate-900/70 px-5 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-400 hover:bg-slate-800"
        type="button"
        onClick={onApply}
      >
        Приложи
      </button>
    </section>
  );
}
