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
    <section className="rounded-3xl border app-border app-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Филтри</h3>
          <p className="mt-1 text-xs text-subtle">
            Филтрирай по име, роля, категория или тагове.
          </p>
        </div>
        <button
          className="rounded-full border app-border app-panel px-5 py-2 text-sm font-medium text-primary transition hover:border-slate-400"
          type="button"
          onClick={onApply}
        >
          Приложи
        </button>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="grid gap-2 text-sm text-muted">
          Име
          <input
            className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary"
            value={name}
            onChange={(event) => onChange("name", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm text-muted">
          Роля
          <select
            className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary"
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
        <label className="grid gap-2 text-sm text-muted">
          Категория
          <select
            className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary"
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
        <label className="grid gap-2 text-sm text-muted">
          Тагове (разделени със запетая)
          <input
            className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary"
            value={tags}
            onChange={(event) => onChange("tags", event.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
