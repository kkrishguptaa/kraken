import { Input } from "@base-ui/react/input";
import type { InputHTMLAttributes } from "react";
import { getAuthInputClassName } from "@/components/auth/auth-styles";

type AuthFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  labelClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export function AuthField({
  id,
  label,
  hint,
  error,
  labelClassName,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={
          labelClassName ??
          "block text-xs uppercase tracking-[0.2em] text-paper-muted"
        }
      >
        {label}
      </label>
      <Input
        id={id}
        className={getAuthInputClassName({
          invalid: Boolean(error),
          className,
        })}
        {...props}
      />
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
      {!error && hint ? (
        <p className="text-xs text-paper-muted">{hint}</p>
      ) : null}
    </div>
  );
}
