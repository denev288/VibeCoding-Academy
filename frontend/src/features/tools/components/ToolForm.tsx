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
    <section className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-6">
      <h3 className="text-lg font-semibold">
        {mode === "edit" ? "Редакция на инструмент" : "Добави нов инструмент"}
      </h3>
      <div className="mt-4 grid gap-4">
        <label className="grid gap-2 text-sm text-slate-300">
          Име
          <input
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
            value={name}
            onChange={(event) => onChange("name", event.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Линк
          <input
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
            value={link}
            onChange={(event) => onChange("link", event.target.value)}
            placeholder="https://"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Документация (линк)
          <input
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
            value={documentationUrl}
            onChange={(event) => onChange("documentationUrl", event.target.value)}
            placeholder="https://"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Документация (markdown)
          <textarea
            className="min-h-[120px] rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
            value={documentation}
            onChange={(event) => onChange("documentation", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Описание
          <textarea
            className="min-h-[100px] rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
            value={description}
            onChange={(event) => onChange("description", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Как се използва
          <textarea
            className="min-h-[120px] rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
            value={howToUse}
            onChange={(event) => onChange("howToUse", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Реални примери (по един линк на ред)
          <textarea
            className="min-h-[80px] rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
            value={examples}
            onChange={(event) => onChange("examples", event.target.value)}
          />
        </label>
      </div>

      <div className="mt-6 grid gap-5">
        <div>
          <p className="text-sm font-semibold text-slate-200">Категории</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onToggleCategory(category.id)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  selectedCategoryIds.includes(category.id)
                    ? "border-emerald-400/70 bg-emerald-500/10 text-emerald-200"
                    : "border-slate-700 bg-slate-900/60 text-slate-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <input
            className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
            placeholder="Нова категория (по избор)"
            value={newCategory}
            onChange={(event) => onChange("newCategory", event.target.value)}
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-200">Роли</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => onToggleRole(role)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  selectedRoleKeys.includes(role)
                    ? "border-indigo-400/70 bg-indigo-500/10 text-indigo-200"
                    : "border-slate-700 bg-slate-900/60 text-slate-300"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-200">Тагове</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => onToggleTag(tag.id)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  selectedTagIds.includes(tag.id)
                    ? "border-amber-400/70 bg-amber-500/10 text-amber-200"
                    : "border-slate-700 bg-slate-900/60 text-slate-300"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
          <input
            className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100"
            placeholder="Нови тагове (разделени със запетая)"
            value={newTags}
            onChange={(event) => onChange("newTags", event.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
          type="button"
          onClick={onSubmit}
        >
          {mode === "edit" ? "Запази промените" : "Запази инструмента"}
        </button>
        {mode === "edit" && onCancel ? (
          <button
            className="rounded-full border border-slate-700/70 bg-slate-900/70 px-5 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-400 hover:bg-slate-800"
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
