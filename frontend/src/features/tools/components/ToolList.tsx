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

  return (
    <section className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      {tools.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">Няма резултати.</p>
      ) : (
        <div className="mt-4 grid gap-4">
          {tools.map((tool) => (
            <article
              key={tool.id}
              className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-base font-semibold text-slate-100">
                  {tool.name}
                </h4>
                <div className="flex items-center gap-2 text-xs">
                  {tool.link ? (
                    <a
                      className="text-emerald-300 hover:text-emerald-200"
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
                      className="text-slate-300 hover:text-slate-100"
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
                <p className="mt-2 text-sm text-slate-300">
                  {tool.description}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-slate-500">
                Създадено от:{" "}
                <span className="text-slate-300">
                  {tool.creator?.name ||
                    tool.creator?.email ||
                    (tool.created_by ? `Потребител #${tool.created_by}` : "—")}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                {tool.categories?.map((category) => (
                  <span key={category.id} className="rounded-full bg-slate-800 px-2 py-1">
                    {category.name}
                  </span>
                ))}
                {tool.tags?.map((tag) => (
                  <span key={tag.id} className="rounded-full bg-slate-800 px-2 py-1">
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
