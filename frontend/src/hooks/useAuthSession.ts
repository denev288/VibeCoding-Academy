import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

const SESSION_FLAG = "vc_session_active";
const USER_CACHE = "vc_user";

export function useAuthSession() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const hasSessionFlag =
      typeof window !== "undefined" &&
      window.localStorage.getItem(SESSION_FLAG) === "true";

    if (!hasSessionFlag) {
      setIsChecking(false);
      return;
    }

    if (typeof window !== "undefined") {
      const cached = window.localStorage.getItem(USER_CACHE);
      if (cached) {
        try {
          setUser(JSON.parse(cached) as User);
        } catch {
          window.localStorage.removeItem(USER_CACHE);
        }
      }
    }

    fetchUser()
      .then((data) => {
        setUser(data);
        if (typeof window !== "undefined") {
          if (data) {
            window.localStorage.setItem(USER_CACHE, JSON.stringify(data));
          } else {
            window.localStorage.removeItem(USER_CACHE);
            window.localStorage.removeItem(SESSION_FLAG);
          }
        }
      })
      .catch(() => undefined)
      .finally(() => setIsChecking(false));
  }, []);

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
      if (typeof window !== "undefined") {
        if (current) {
          window.localStorage.setItem(USER_CACHE, JSON.stringify(current));
          window.localStorage.setItem(SESSION_FLAG, "true");
        } else {
          window.localStorage.removeItem(USER_CACHE);
          window.localStorage.removeItem(SESSION_FLAG);
        }
      }
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
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_CACHE);
      window.localStorage.removeItem(SESSION_FLAG);
    }
    setStatus("Излязъл");
    router.push("/");
  };

  return {
    user,
    status,
    error,
    isChecking,
    login: handleLogin,
    logout: handleLogout,
  };
}
