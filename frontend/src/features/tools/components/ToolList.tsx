import type { Tool } from "../types";

type ToolListProps = {
  tools: Tool[];
  title?: string;
  currentUserId?: number | null;
  onEdit?: (tool: Tool) => void;
  onDelete?: (tool: Tool) => void;
};

export default function ToolList({
  tools,
  title = "Инструменти",
  currentUserId = null,
  onEdit,
  onDelete,
}: ToolListProps) {
  const showActions = Boolean(onEdit || onDelete);
  const statusLabel = (status?: string | null) => {
    if (status === "approved") return "Одобрен";
    if (status === "rejected") return "Отказан";
    if (status === "pending") return "Изчакване";
    return "—";
  };
  const statusClass = (status?: string | null) => {
    if (status === "approved") return "text-emerald-300";
    if (status === "rejected") return "text-rose-300";
    if (status === "pending") return "text-orange-300";
    return "text-muted";
  };

  return (
    <section className="rounded-3xl border app-border app-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-xs text-subtle">
            Общо: {tools.length}
          </p>
        </div>
        {showActions ? (
          <span className="rounded-full border app-border app-panel px-3 py-1 text-xs text-subtle">
            Управление на инструментите
          </span>
        ) : null}
      </div>
      {tools.length === 0 ? (
        <p className="mt-3 text-sm text-subtle">Няма резултати.</p>
      ) : (
        <div className="mt-4 grid gap-4">
          {tools.map((tool) => (
            <article
              key={tool.id}
              className="rounded-2xl border app-border app-panel p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-base font-semibold text-primary">
                  {tool.name}
                </h4>
                <div className="flex items-center gap-2 text-xs">
                  {tool.link ? (
                    <a
                      className="accent-text hover:text-[color:var(--accent)]"
                      href={tool.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Линк
                    </a>
                  ) : null}
                  {showActions &&
                  onEdit &&
                  currentUserId &&
                  tool.created_by === currentUserId ? (
                    <button
                      className="text-muted hover:text-primary"
                      type="button"
                      onClick={() => onEdit(tool)}
                    >
                      Редакция
                    </button>
                  ) : null}
                  {showActions &&
                  onDelete &&
                  currentUserId &&
                  tool.created_by === currentUserId ? (
                    <button
                      className="text-rose-300 hover:text-rose-200"
                      type="button"
                      onClick={() => onDelete(tool)}
                    >
                      Изтриване
                    </button>
                  ) : null}
                </div>
              </div>
              {tool.description ? (
                <p className="mt-2 text-sm text-muted">
                  {tool.description}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-subtle">
                Статус:{" "}
                <span className={statusClass(tool.status)}>
                  {statusLabel(tool.status)}
                </span>
              </p>
              <p className="mt-3 text-xs text-subtle">
                Създадено от:{" "}
                <span className="text-muted">
                  {tool.creator?.name ||
                    tool.creator?.email ||
                    (tool.created_by ? `Потребител #${tool.created_by}` : "—")}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-subtle">
                {tool.categories?.map((category) => (
                  <span key={category.id} className="rounded-full app-panel px-2 py-1">
                    {category.name}
                  </span>
                ))}
                {tool.tags?.map((tag) => (
                  <span key={tag.id} className="rounded-full app-panel px-2 py-1">
                    #{tag.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
