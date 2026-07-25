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
        className={`flex min-h-[52px] items-center gap-3 rounded-input border-[1.5px] bg-surface px-4 transition-default focus-within:border-accent focus-within:ring-[3px] focus-within:ring-forest-50 ${
          error ? "border-error focus-within:ring-red-50" : "border-border-default"
        }`}
      >
        {left}
        <input
          className={`h-12 w-full bg-transparent text-[17px] font-normal text-ink outline-none placeholder:text-muted ${inputClassName}`}
          {...inputProps}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      {hint && !error ? <p className="mt-2 text-sm text-muted">{hint}</p> : null}
    </label>
  );
}
