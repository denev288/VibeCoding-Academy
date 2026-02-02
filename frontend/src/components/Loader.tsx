type LoaderProps = {
  label?: string;
};

export default function Loader({ label = "Зареждане..." }: LoaderProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-400">
      <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
