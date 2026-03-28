import type { ButtonProps as BaseButtonProps } from "@base-ui/react/button";
import { Button as BaseButton } from "@base-ui/react/button";
import clsx, { type ClassValue } from "clsx";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "underline"
  | "surface"
  | "danger";

const ButtonVariants: {
  [x in ButtonVariant]: ClassValue;
} = {
  primary:
    "bg-paper-ink text-paper-base font-semibold border border-paper-ink hover:bg-paper-ink/0 hover:text-paper-ink transition-colors",
  secondary:
    "border border-paper-border text-paper-ink hover:bg-paper-border transition-colors",
  underline: "text-paper-ink underline-offset-4 hover:underline",
  surface:
    "w-full border border-paper-border bg-white text-paper-ink font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 transition",
  danger:
    "bg-red-600 text-white border border-red-600 font-semibold hover:bg-red-700 transition-colors",
};

export function Button({
  children,
  variant,
  className,
  ...props
}: {
  children: React.ReactNode;
  variant: keyof typeof ButtonVariants;
  className?: string;
} & Omit<BaseButtonProps, "children" | "className">) {
  return (
    <BaseButton
      className={clsx(className, ButtonVariants[variant], "px-4", "py-2")}
      {...props}
    >
      {children}
    </BaseButton>
  );
}

export function ButtonNoButton({
  children,
  as,
  variant,
  className,
}: {
  children: React.ReactNode;
  as: React.ReactElement;
  variant: keyof typeof ButtonVariants;
  className?: string;
}) {
  return (
    <BaseButton
      className={clsx(className, ButtonVariants[variant])}
      render={as}
      nativeButton={false}
    >
      {children}
    </BaseButton>
  );
}
