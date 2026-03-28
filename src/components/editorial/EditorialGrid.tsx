import type { ReactNode } from "react";

interface EditorialGridProps {
  children: ReactNode;
  className?: string;
}

export function EditorialGrid({
  children,
  className = "",
}: EditorialGridProps) {
  return (
    <div
      className={`
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        grid-flow-dense
        auto-rows-[240px]
        gap-0
        divide-x divide-y border
        divide-paper-border
        border-paper-border
        ${className}
      `}
    >
      {children}
    </div>
  );
}
