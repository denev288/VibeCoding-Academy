'use client';

import { useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8201';

async function getCsrfCookie() {
  await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
  });
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fetchUser = async () => {
    const res = await fetch(`${API_BASE}/api/user`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      setUser(null);
      return;
    }

    const data = (await res.json()) as User;
    setUser(data);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setStatus('Logging in...');

    try {
      await getCsrfCookie();
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload?.message ?? 'Login failed');
        setStatus('');
        return;
      }

      await fetchUser();
      setStatus('Logged in');
    } catch (err) {
      setError('Login failed');
      setStatus('');
    }
  };

  const handleLogout = async () => {
    setError('');
    setStatus('Logging out...');

    await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });

    setUser(null);
    setStatus('Logged out');
  };

  const checkStatus = async () => {
    const res = await fetch(`${API_BASE}/api/status`);
    const payload = await res.json();
    setStatus(`API: ${payload.status} at ${payload.timestamp}`);
  };

  return (
    <main style={{ maxWidth: 640, margin: '40px auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>VibeCoding Full Stack</h1>

      <section style={{ marginTop: 24 }}>
        <h2>API Status</h2>
        <button type="button" onClick={checkStatus} style={{ marginRight: 12 }}>
          Check API
        </button>
        <span>{status}</span>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              style={{ width: '100%' }}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              style={{ width: '100%' }}
            />
          </label>
          <button type="submit">Login</button>
        </form>
        {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>User</h2>
        {user ? (
          <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role ?? 'n/a'}</p>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <p>Not authenticated</p>
        )}
      </section>
    </main>
  );
}
