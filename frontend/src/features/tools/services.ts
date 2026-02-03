import type { Category, Tag, Tool } from "./types";
import { getCsrfCookie, readXsrfToken } from "@/services/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8201";

export type ToolFilters = {
  name?: string;
  role?: string;
  category?: string;
  tags?: string;
};

export type CreateToolPayload = {
  name: string;
  link?: string;
  documentation_url?: string;
  documentation?: string;
  description?: string;
  how_to_use?: string;
  examples?: string[];
  category_ids?: number[];
  new_category?: string;
  role_keys?: string[];
  tag_ids?: number[];
  new_tags?: string[];
};

export async function fetchRoles(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/roles`, {
    credentials: "include",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/api/categories`, {
    credentials: "include",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch(`${API_BASE}/api/tags`, {
    credentials: "include",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function createCategory(name: string): Promise<Category | null> {
  await getCsrfCookie();
  const xsrfToken = readXsrfToken();
  const res = await fetch(`${API_BASE}/api/categories`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function createTag(name: string): Promise<Tag | null> {
  await getCsrfCookie();
  const xsrfToken = readXsrfToken();
  const res = await fetch(`${API_BASE}/api/tags`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchTools(filters: ToolFilters = {}): Promise<Tool[]> {
  const params = new URLSearchParams();
  if (filters.name) params.set("name", filters.name);
  if (filters.role) params.set("role", filters.role);
  if (filters.category) params.set("category", filters.category);
  if (filters.tags) params.set("tags", filters.tags);
  const query = params.toString();

  const res = await fetch(`${API_BASE}/api/tools${query ? `?${query}` : ""}`, {
    credentials: "include",
  });
  if (!res.ok) return [];
  return res.json();
}

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

async function parseError(res: Response): Promise<string> {
  const payload = await res.json().catch(() => ({}));
  if (payload?.message) return payload.message;
  if (payload?.errors) return "Невалидни данни.";
  return "Възникна грешка.";
}

export async function createTool(
  payload: CreateToolPayload
): Promise<ApiResult<Tool>> {
  await getCsrfCookie();
  const xsrfToken = readXsrfToken();
  const res = await fetch(`${API_BASE}/api/tools`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return { ok: false, error: await parseError(res) };
  return { ok: true, data: await res.json() };
}

export async function updateTool(
  id: number,
  payload: CreateToolPayload
): Promise<ApiResult<Tool>> {
  await getCsrfCookie();
  const xsrfToken = readXsrfToken();
  const res = await fetch(`${API_BASE}/api/tools/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return { ok: false, error: await parseError(res) };
  return { ok: true, data: await res.json() };
}

export async function deleteTool(id: number): Promise<ApiResult<null>> {
  await getCsrfCookie();
  const xsrfToken = readXsrfToken();
  const res = await fetch(`${API_BASE}/api/tools/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
    },
  });
  if (!res.ok) return { ok: false, error: await parseError(res) };
  return { ok: true, data: null };
}

export async function requestToolDeleteCode(
  id: number,
  email?: string
): Promise<ApiResult<null>> {
  await getCsrfCookie();
  const xsrfToken = readXsrfToken();
  const res = await fetch(`${API_BASE}/api/tools/${id}/delete-request`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
    },
    body: JSON.stringify(email ? { email } : {}),
  });
  if (!res.ok) return { ok: false, error: await parseError(res) };
  return { ok: true, data: null };
}

export async function confirmToolDeleteCode(
  id: number,
  code: string
): Promise<ApiResult<null>> {
  await getCsrfCookie();
  const xsrfToken = readXsrfToken();
  const res = await fetch(`${API_BASE}/api/tools/${id}/delete-confirm`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
    },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) return { ok: false, error: await parseError(res) };
  return { ok: true, data: null };
}
