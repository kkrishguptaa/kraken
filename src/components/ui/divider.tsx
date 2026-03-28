import { Separator } from "@base-ui/react/separator";
import clsx, { type ClassValue } from "clsx";

type DividerVariant = "default" | "thick";

const DividerVariants: {
  [x in DividerVariant]: ClassValue;
} = {
  default: "bg-paper-border",
  thick: "bg-paper-ink h-0.5",
};

export function Divider({
  variant = "default",
  className,
}: {
  variant?: DividerVariant;
  className?: string;
}) {
  return <Separator className={clsx(DividerVariants[variant], className)} />;
}
