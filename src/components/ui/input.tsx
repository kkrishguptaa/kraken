import { Input as BaseInput } from "@base-ui/react/input";
import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

const inputBaseClassName = clsx(
  "w-full cursor-text border bg-white px-3 py-2 text-sm outline-none transition",
  "border-paper-border text-paper-ink",
  "focus:border-paper-accent focus:ring-2 focus:ring-[rgb(106_64_32_/_0.2)]",
);

const inputErrorClassName =
  "border-red-600 focus:border-red-600 focus:ring-red-200";

type InputProps = {
  error?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ error = false, className, ...props }: InputProps) {
  return (
    <BaseInput
      className={clsx(
        inputBaseClassName,
        error && inputErrorClassName,
        className,
      )}
      {...props}
    />
  );
}
