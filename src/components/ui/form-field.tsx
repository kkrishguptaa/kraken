import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";

type FormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  labelClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export function FormField({
  id,
  label,
  hint,
  error,
  labelClassName,
  ...props
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={
          labelClassName ??
          "block text-sm uppercase tracking-meta text-paper-muted"
        }
      >
        {label}
      </label>
      <Input id={id} error={Boolean(error)} {...props} />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {!error && hint ? (
        <p className="text-sm text-paper-muted">{hint}</p>
      ) : null}
    </div>
  );
}
