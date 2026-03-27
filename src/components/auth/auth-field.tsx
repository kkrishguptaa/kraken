import { Input } from "@base-ui/react/input";
import type { InputHTMLAttributes } from "react";

type AuthFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export function AuthField({
  id,
  label,
  hint,
  error,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-xs uppercase tracking-[0.2em] text-paper-muted"
      >
        {label}
      </label>
      <Input
        id={id}
        className={[
          "w-full cursor-text border bg-white px-3 py-2 text-sm outline-none transition",
          "border-paper-border text-paper-ink",
          "focus:border-paper-accent focus:ring-2 focus:ring-[rgb(106_64_32_/_0.2)]",
          error ? "border-red-600 focus:border-red-600 focus:ring-red-200" : "",
          className ?? "",
        ].join(" ")}
        {...props}
      />
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
      {!error && hint ? (
        <p className="text-xs text-paper-muted">{hint}</p>
      ) : null}
    </div>
  );
}
