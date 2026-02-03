"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import LoginForm from "@/components/LoginForm";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import ToolFilters from "@/features/tools/components/ToolFilters";
import ToolForm from "@/features/tools/components/ToolForm";
import ToolList from "@/features/tools/components/ToolList";
import {
  confirmToolDeleteCode,
  createTool,
  fetchCategories,
  fetchRoles,
  fetchTags,
  fetchTools,
  requestToolDeleteCode,
  updateTool,
} from "@/features/tools/services";
import type { Category, Tag, Tool } from "@/features/tools/types";

export default function ToolsPage() {
  const router = useRouter();
  const { user, status, error, isChecking, login, logout } = useAuthSession();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [tools, setTools] = useState<Tool[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [filters, setFilters] = useState({
    name: "",
    role: "",
    category: "",
    tags: "",
  });

  const [form, setForm] = useState({
    name: "",
    link: "",
    documentationUrl: "",
    documentation: "",
    description: "",
    howToUse: "",
    examples: "",
    newCategory: "",
    newTags: "",
  });

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedRoleKeys, setSelectedRoleKeys] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [formStatus, setFormStatus] = useState<string>("");
  const [editingToolId, setEditingToolId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pendingDelete, setPendingDelete] = useState<Tool | null>(null);
  const [deleteCode, setDeleteCode] = useState("");
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleteStep, setDeleteStep] = useState<"idle" | "sent">("idle");
  const [deleteStatus, setDeleteStatus] = useState<string>("");
  const [toasts, setToasts] = useState<
    { id: string; message: string; tone: "success" | "error" }[]
  >([]);
  useEffect(() => {
    if (!user) return;
    fetchTools().then(setTools).catch(() => setTools([]));
    fetchRoles().then(setRoles).catch(() => setRoles([]));
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchTags().then(setTags).catch(() => setTags([]));
  }, [user]);

  const applyFilters = () => {
    fetchTools(filters).then(setTools).catch(() => setTools([]));
  };

  const toggleId = (list: number[], id: number) =>
    list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

  const resetForm = () => {
    setForm({
      name: "",
      link: "",
      documentationUrl: "",
      documentation: "",
      description: "",
      howToUse: "",
      examples: "",
      newCategory: "",
      newTags: "",
    });
    setSelectedCategoryIds([]);
    setSelectedRoleKeys([]);
    setSelectedTagIds([]);
    setEditingToolId(null);
  };

  const handleSubmit = async () => {
    setFormStatus("Записване...");
    const payload = {
      name: form.name,
      link: form.link || undefined,
      documentation_url: form.documentationUrl || undefined,
      documentation: form.documentation || undefined,
      description: form.description || undefined,
      how_to_use: form.howToUse || undefined,
      examples: form.examples
        ? form.examples.split("\n").map((value) => value.trim()).filter(Boolean)
        : undefined,
      category_ids: selectedCategoryIds,
      new_category: form.newCategory || undefined,
      role_keys: selectedRoleKeys,
      tag_ids: selectedTagIds,
      new_tags: form.newTags
        ? form.newTags.split(",").map((value) => value.trim()).filter(Boolean)
        : undefined,
    };

    const result = editingToolId
      ? await updateTool(editingToolId, payload)
      : await createTool(payload);

    if (result.ok) {
      setFormStatus(editingToolId ? "Запазени промени!" : "Запазено!");
      resetForm();
      fetchTools(filters).then(setTools).catch(() => setTools([]));
      fetchCategories().then(setCategories).catch(() => setCategories([]));
      fetchTags().then(setTags).catch(() => setTags([]));
      setIsModalOpen(false);
      pushToast(
        editingToolId ? "Инструментът е обновен." : "Инструментът е добавен.",
        "success"
      );
    } else {
      setFormStatus(result.error ?? "Грешка при запис.");
      pushToast(result.error ?? "Грешка при запис.", "error");
    }
  };

  const handleEdit = (tool: Tool) => {
    if (!user || tool.created_by !== user.id) return;
    setEditingToolId(tool.id);
    setForm({
      name: tool.name ?? "",
      link: tool.link ?? "",
      documentationUrl: tool.documentation_url ?? "",
      documentation: tool.documentation ?? "",
      description: tool.description ?? "",
      howToUse: tool.how_to_use ?? "",
      examples: tool.examples ? tool.examples.join("\n") : "",
      newCategory: "",
      newTags: "",
    });
    setSelectedCategoryIds(tool.categories?.map((item) => item.id) ?? []);
    setSelectedRoleKeys(tool.role_assignments?.map((item) => item.role) ?? []);
    setSelectedTagIds(tool.tags?.map((item) => item.id) ?? []);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (tool: Tool) => {
    if (!user || tool.created_by !== user.id) return;
    setPendingDelete(tool);
    setDeleteCode("");
    setDeleteEmail(user?.email ?? "");
    setDeleteStep("idle");
    setDeleteStatus("");
  };

  const sendDeleteCode = async () => {
    if (!pendingDelete) return;
    setDeleteStatus("Изпращане на код...");
    const result = await requestToolDeleteCode(
      pendingDelete.id,
      deleteEmail.trim() || undefined
    );
    if (result.ok) {
      setDeleteStep("sent");
      setDeleteStatus("Кодът е изпратен на email.");
      pushToast("Изпратихме код на email.", "success");
    } else {
      setDeleteStatus(result.error ?? "Грешка при изпращане на код.");
      pushToast(result.error ?? "Грешка при изпращане на код.", "error");
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleteStatus("Потвърждение...");
    const result = await confirmToolDeleteCode(
      pendingDelete.id,
      deleteCode.trim()
    );
    if (result.ok) {
      fetchTools(filters).then(setTools).catch(() => setTools([]));
      pushToast("Инструментът е изтрит.", "success");
      setPendingDelete(null);
      setDeleteCode("");
      setDeleteStep("idle");
      setDeleteStatus("");
    } else {
      setDeleteStatus(result.error ?? "Грешка при потвърждение.");
      pushToast(result.error ?? "Грешка при потвърждение.", "error");
    }
  };

  const pushToast = (message: string, tone: "success" | "error") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  return (
    <div className="min-h-screen app-shell">
      <AppHeader
        isAuthenticated={Boolean(user)}
        onLogout={() => {
          logout();
          setTools([]);
          setRoles([]);
          setCategories([]);
          setTags([]);
          router.replace("/");
        }}
        userName={user?.name}
        userEmail={user?.email}
        userRole={user?.role}
        links={
          user
            ? [
                { label: "Начало", href: "/" },
                { label: "Инструменти", href: "/tools" },
              ]
            : []
        }
      />

      <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-16 pt-4">
        {isChecking ? (
          <section className="rounded-3xl border app-border app-surface p-6">
            <Loader label="Проверка на сесията..." />
          </section>
        ) : !user ? (
          <LoginForm
            email={loginEmail}
            password={loginPassword}
            status={status}
            error={error}
            onEmailChange={setLoginEmail}
            onPasswordChange={setLoginPassword}
            onSubmit={(event) => {
              event.preventDefault();
              login({ email: loginEmail, password: loginPassword });
            }}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Инструменти</h2>
                <p className="mt-1 text-sm text-subtle">
                  Управлявай списъка с AI инструменти и добавяй нови.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="rounded-full accent-border accent-soft px-4 py-2 text-sm accent-text transition hover:border-(--accent)"
                  onClick={() => {
                    resetForm();
                    setEditingToolId(null);
                    setIsModalOpen(false);
                  }}
                >
                  Съществуващи инструменти
                </button>
                <button
                  type="button"
                  className="rounded-full border app-border app-panel px-4 py-2 text-sm text-primary transition hover:border-slate-500"
                  onClick={() => {
                    resetForm();
                    setEditingToolId(null);
                    setIsModalOpen(true);
                  }}
                >
                  Добавяне на инструмент
                </button>
              </div>
            </div>

            <ToolFilters
              name={filters.name}
              role={filters.role}
              category={filters.category}
              tags={filters.tags}
              roles={roles}
              categories={categories}
              onChange={(field, value) =>
                setFilters((prev) => ({ ...prev, [field]: value }))
              }
              onApply={applyFilters}
            />
            <ToolList
              tools={tools}
              currentUserId={user?.id ?? null}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />

            {isModalOpen ? (
              <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-12 backdrop-blur-sm">
                <div className="w-full max-w-4xl rounded-3xl border app-border app-surface p-6 shadow-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-primary">
                        {editingToolId ? "Редакция на инструмент" : "Добави нов инструмент"}
                      </h3>
                      <p className="mt-1 text-xs text-subtle">
                        Попълни нужните полета и запази.
                      </p>
                    </div>
                    <button
                      className="rounded-full border app-border app-panel px-4 py-2 text-xs text-primary hover:border-slate-400"
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
                      }}
                    >
                      Затвори
                    </button>
                  </div>

                  <div className="mt-5">
                    <ToolForm
                      mode={editingToolId ? "edit" : "create"}
                      name={form.name}
                      link={form.link}
                      documentationUrl={form.documentationUrl}
                      documentation={form.documentation}
                      description={form.description}
                      howToUse={form.howToUse}
                      examples={form.examples}
                      selectedCategoryIds={selectedCategoryIds}
                      newCategory={form.newCategory}
                      selectedRoleKeys={selectedRoleKeys}
                      selectedTagIds={selectedTagIds}
                      newTags={form.newTags}
                      roles={roles}
                      categories={categories}
                      tags={tags}
                      onChange={(field, value) =>
                        setForm((prev) => ({ ...prev, [field]: value }))
                      }
                      onToggleRole={(role) =>
                        setSelectedRoleKeys((prev) =>
                          prev.includes(role)
                            ? prev.filter((item) => item !== role)
                            : [...prev, role]
                        )
                      }
                      onToggleCategory={(id) =>
                        setSelectedCategoryIds((prev) => toggleId(prev, id))
                      }
                      onToggleTag={(id) =>
                        setSelectedTagIds((prev) => toggleId(prev, id))
                      }
                      onSubmit={handleSubmit}
                      onCancel={() => {
                        setIsModalOpen(false);
                        resetForm();
                      }}
                    />
                    {formStatus ? (
                      <p className="mt-3 text-sm text-muted">{formStatus}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {pendingDelete ? (
              <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-3xl border app-border app-surface p-6 shadow-2xl">
                  <h3 className="text-lg font-semibold text-primary">
                    Потвърди изтриване
                  </h3>
                    <p className="mt-2 text-sm text-muted">
                      Сигурен ли си, че искаш да изтриеш{" "}
                      <span className="font-semibold text-primary">
                        {pendingDelete.name}
                      </span>
                      ?
                    </p>
                  <div className="mt-4 grid gap-2 text-sm text-muted">
                    <label className="grid gap-2 text-sm text-muted">
                      Имейл за код
                      <input
                        className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary"
                 
                        onChange={(event) => setDeleteEmail(event.target.value)}
                        placeholder="name@example.com"
                        type="email"
                      />
                    </label>
                    {deleteStep === "sent" ? (
                      <label className="grid gap-2 text-sm text-muted">
                        Въведи кода от email
                        <input
                          className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary"
                          value={deleteCode}
                          onChange={(event) => setDeleteCode(event.target.value)}
                          placeholder="6-цифрен код"
                        />
                      </label>
                    ) : null}
                    {deleteStatus ? (
                      <p className="text-xs text-subtle">{deleteStatus}</p>
                    ) : null}
                    {deleteStep !== "sent" ? (
                      <p className="text-xs text-subtle">
                        Ще изпратим 6-цифрен код за потвърждение.
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    <button
                      className="rounded-full border app-border app-panel px-4 py-2 text-xs text-primary hover:border-slate-400"
                      type="button"
                      onClick={() => {
                        setPendingDelete(null);
                        setDeleteCode("");
                        setDeleteEmail("");
                        setDeleteStep("idle");
                        setDeleteStatus("");
                      }}
                    >
                      Откажи
                    </button>
                    {deleteStep === "sent" ? (
                      <button
                        className="rounded-full border border-rose-400/70 bg-rose-500/10 px-4 py-2 text-xs text-rose-200 hover:border-rose-300"
                        type="button"
                        onClick={confirmDelete}
                        disabled={!deleteCode.trim()}
                      >
                        Изтрий
                      </button>
                    ) : (
                      <button
                        className="rounded-full accent-border accent-soft px-4 py-2 text-xs accent-text"
                        type="button"
                        onClick={sendDeleteCode}
                        disabled={!deleteEmail.trim()}
                      >
                        Изпрати код
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
      </main>

      <div className="pointer-events-none fixed bottom-6 right-6 z-60 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto w-70 rounded-2xl border px-4 py-3 text-sm shadow-xl ${
              toast.tone === "success"
                ? "accent-border accent-soft accent-text"
                : "border-rose-400/50 bg-rose-400/10 text-rose-200"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
