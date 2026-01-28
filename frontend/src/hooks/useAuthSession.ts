import { useState } from "react";
import type { User } from "@/types/user";
import {
  fetchUser,
  getCsrfCookie,
  login,
  logout,
} from "@/services/auth";

type LoginInput = {
  email: string;
  password: string;
};

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (input: LoginInput) => {
    setError("");
    setStatus("Влизане...");

    try {
      await getCsrfCookie();
      const res = await login(input);

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload?.message ?? "Грешно потребителско име или парола.");
        setStatus("");
        return;
      }

      const current = await fetchUser();
      setUser(current);
      setStatus("Успешен вход.");
    } catch (err) {
      setError("Възникна проблем при вход.");
      setStatus("");
    }
  };

  const handleLogout = async () => {
    setError("");
    setStatus("Изход...");
    await logout();
    setUser(null);
    setStatus("Излязъл");
  };

  return {
    user,
    status,
    error,
    login: handleLogin,
    logout: handleLogout,
  };
}
