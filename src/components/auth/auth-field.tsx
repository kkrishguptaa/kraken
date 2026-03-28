import type { InputHTMLAttributes } from "react";
import { FormField } from "@/components/ui/form-field";

type AuthFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  labelClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export function AuthField(props: AuthFieldProps) {
  return <FormField {...props} />;
}
