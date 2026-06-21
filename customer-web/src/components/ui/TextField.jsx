export function TextField({
  label,
  hint,
  error,
  left,
  className = "",
  inputClassName = "",
  ...inputProps
}) {
  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="mb-2 block text-sm font-medium text-sub">{label}</span>
      ) : null}
      <div
        className={`flex min-h-14 items-center gap-3 rounded-xl border bg-surface px-3 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 ${
          error ? "border-red-400" : "border-border"
        }`}
      >
        {left}
        <input
          className={`h-12 w-full bg-transparent text-lg font-medium text-ink outline-none placeholder:text-muted ${inputClassName}`}
          {...inputProps}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      {hint && !error ? <p className="mt-2 text-sm text-muted">{hint}</p> : null}
    </label>
  );
}
