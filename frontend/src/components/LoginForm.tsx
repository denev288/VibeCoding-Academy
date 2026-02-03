type LoginFormProps = {
  email: string;
  password: string;
  status: string;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export default function LoginForm({
  email,
  password,
  status,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <section className="rounded-3xl border app-border app-surface p-8 shadow-2xl shadow-black/40 lg:col-span-2">
      <h2 className="text-2xl font-semibold text-primary">Вход</h2>
      <p className="mt-2 text-sm text-muted">
        Въведи своя имейл и парола, за да продължиш.
      </p>
      <form className="mt-6 grid gap-4 sm:max-w-md" onSubmit={onSubmit}>
        <label className="grid gap-2 text-sm text-muted">
          Email
          <input
            className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary outline-none ring-0 focus:border-slate-500"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            required
          />
        </label>
        <label className="grid gap-2 text-sm text-muted">
          Парола
          <input
            className="rounded-xl border app-border app-panel px-3 py-2 text-sm text-primary outline-none ring-0 focus:border-slate-500"
            
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            required
          />
        </label>
        <button
          className="rounded-full accent-bg px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-[color:color-mix(in_oklab,var(--accent)_85%,white)]"
          type="submit"
        >
          Влез
        </button>
      </form>
      {status ? <p className="mt-3 text-xs text-muted">{status}</p> : null}
      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </section>
  );
}
