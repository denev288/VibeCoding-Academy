import type { Category, Tag } from "../types";

type ToolFormProps = {
  mode?: "create" | "edit";
  name: string;
  link: string;
  documentationUrl: string;
  documentation: string;
  description: string;
  howToUse: string;
  examples: string;
  selectedCategoryIds: number[];
  newCategory: string;
  selectedRoleKeys: string[];
  selectedTagIds: number[];
  newTags: string;
  roles: string[];
  categories: Category[];
  tags: Tag[];
  onChange: (field: string, value: string) => void;
  onToggleRole: (role: string) => void;
  onToggleCategory: (id: number) => void;
  onToggleTag: (id: number) => void;
  onSubmit: () => void;
  onCancel?: () => void;
};

export default function ToolForm({
  mode = "create",
  name,
  link,
  documentationUrl,
  documentation,
  description,
  howToUse,
  examples,
  selectedCategoryIds,
  newCategory,
  selectedRoleKeys,
  selectedTagIds,
  newTags,
  roles,
  categories,
  tags,
  onChange,
  onToggleRole,
  onToggleCategory,
  onToggleTag,
  onSubmit,
  onCancel,
}: ToolFormProps) {
  return (
    <section className="rounded-3xl border app-border app-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">
            {mode === "edit"
              ? "Редакция на инструмент"
              : "Добави нов инструмент"}
          </h3>
          <p className="mt-1 text-xs text-subtle">
            Попълни основната информация и избери роли/категории.
          </p>
        </div>
        <span className="rounded-full border app-border app-panel px-3 py-1 text-xs text-subtle">
          {mode === "edit" ? "Редакция" : "Създаване"}
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2 text-sm text-muted">
          Име
          <input
            className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary focus:border-(--accent) focus:outline-none"
            value={name}
            onChange={(event) => onChange("name", event.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 text-sm text-muted">
          Линк
          <input
            className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary focus:border-(--accent) focus:outline-none"
            value={link}
            onChange={(event) => onChange("link", event.target.value)}
            placeholder="https://"
          />
        </label>
        <label className="grid gap-2 text-sm text-muted">
          Документация (линк)
          <input
            className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary focus:border-(--accent) focus:outline-none"
            value={documentationUrl}
            onChange={(event) => onChange("documentationUrl", event.target.value)}
            placeholder="https://"
          />
        </label>
        <label className="grid gap-2 text-sm text-muted lg:col-span-2">
          Документация (markdown)
          <textarea
            className="min-h-30 rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary focus:border-(--accent) focus:outline-none"
            value={documentation}
            onChange={(event) => onChange("documentation", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm text-muted">
          Описание
          <textarea
            className="min-h-25 rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary focus:border-(--accent) focus:outline-none"
            value={description}
            onChange={(event) => onChange("description", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm text-muted">
          Как се използва
          <textarea
            className="min-h-30 rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary focus:border-(--accent) focus:outline-none"
            value={howToUse}
            onChange={(event) => onChange("howToUse", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm text-muted lg:col-span-2">
          Реални примери (по един линк на ред)
          <textarea
            className="min-h-20 rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary focus:border-(--accent) focus:outline-none"
            value={examples}
            onChange={(event) => onChange("examples", event.target.value)}
          />
        </label>
      </div>

      <div className="mt-6 grid gap-5">
        <div>
          <p className="text-sm font-semibold text-primary">Категории</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onToggleCategory(category.id)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  selectedCategoryIds.includes(category.id)
                    ? "accent-border accent-soft accent-text"
                    : "border-slate-700 app-panel text-muted"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <input
            className="mt-3 w-full rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary focus:border-(--accent) focus:outline-none"
            placeholder="Нова категория (по избор)"
            value={newCategory}
            onChange={(event) => onChange("newCategory", event.target.value)}
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-primary">Роли</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => onToggleRole(role)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  selectedRoleKeys.includes(role)
                    ? "border-indigo-400/70 bg-indigo-500/10 text-indigo-200"
                    : "border-slate-700 app-panel text-muted"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-primary">Тагове</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => onToggleTag(tag.id)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  selectedTagIds.includes(tag.id)
                    ? "border-amber-400/70 bg-amber-500/10 text-amber-200"
                    : "border-slate-700 app-panel text-muted"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
          <input
            className="mt-3 w-full rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary focus:border-(--accent) focus:outline-none"
            placeholder="Нови тагове (разделени със запетая)"
            value={newTags}
            onChange={(event) => onChange("newTags", event.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="rounded-full accent-bg px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-[color-mix(in_oklab,var(--accent)_85%,white)]"
          type="button"
          onClick={onSubmit}
        >
          {mode === "edit" ? "Запази промените" : "Запази инструмента"}
        </button>
        {mode === "edit" && onCancel ? (
          <button
            className="rounded-full border app-border app-panel px-5 py-2 text-sm font-medium text-primary transition hover:border-slate-400"
            type="button"
            onClick={onCancel}
          >
            Откажи
          </button>
        ) : null}
      </div>
    </section>
  );
}
