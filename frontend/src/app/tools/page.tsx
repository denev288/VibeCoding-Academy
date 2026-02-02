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
  createTool,
  deleteTool,
  fetchCategories,
  fetchRoles,
  fetchTags,
  fetchTools,
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
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!user) {
      setTools([]);
      setRoles([]);
      setCategories([]);
      setTags([]);
      return;
    }
    fetchTools().then(setTools).catch(() => setTools([]));
    fetchRoles().then(setRoles).catch(() => setRoles([]));
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchTags().then(setTags).catch(() => setTags([]));
  }, [userId]);

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
      setActiveTab("list");
    } else {
      setFormStatus(result.error ?? "Грешка при запис.");
    }
  };

  const handleEdit = (tool: Tool) => {
    if (!user || tool.created_by !== user.id) return;
    setActiveTab("form");
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
  };

  const handleDelete = async (tool: Tool) => {
    if (!user || tool.created_by !== user.id) return;
    const confirmed = window.confirm(`Изтриване на "${tool.name}"?`);
    if (!confirmed) return;
    const result = await deleteTool(tool.id);
    if (result.ok) {
      fetchTools(filters).then(setTools).catch(() => setTools([]));
    } else {
      setFormStatus(result.error ?? "Грешка при изтриване.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#18212f,_#0b0f1a_55%,_#07090f)] text-slate-100">
      <AppHeader
        isAuthenticated={Boolean(user)}
        onLogout={() => {
          logout();
          router.replace("/");
        }}
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
          <section className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-6">
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
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  activeTab === "list"
                    ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-200"
                    : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-500"
                }`}
                onClick={() => setActiveTab("list")}
              >
                Съществуващи инструменти
              </button>
              <button
                type="button"
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  activeTab === "form"
                    ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-200"
                    : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-500"
                }`}
                onClick={() => {
                  resetForm();
                  setActiveTab("form");
                }}
              >
                Добавяне на инструмент
              </button>
            </div>

            {activeTab === "form" ? (
              <>
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
                  onCancel={resetForm}
                />
                {formStatus ? (
                  <p className="text-sm text-slate-300">{formStatus}</p>
                ) : null}
              </>
            ) : (
              <>
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
                  onDelete={handleDelete}
                />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
