const AuthInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-ink"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-[var(--radius-sm)] border border-line bg-page px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/10"
      />

      {error && (
        <p className="mt-1.5 text-xs text-status-danger">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;