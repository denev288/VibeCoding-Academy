import type { User } from "@/types/user";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8201";

export const getCsrfCookie = async () => {
  await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
  });
};

export const fetchUser = async (): Promise<User | null> => {
  const res = await fetch(`${API_BASE}/api/user`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return null;

  return (await res.json()) as User;
};

export const login = async (payload: { email: string; password: string }) => {
  const xsrfToken = readXsrfToken();
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    credentials: "include",
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
    },
    body: JSON.stringify(payload),
  });

  return res;
};

export const logout = async () => {
  await fetch(`${API_BASE}/api/logout`, {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
};

export const readXsrfToken = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};
