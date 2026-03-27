import type { ReactNode } from "react";

interface EditorialGridProps {
  children: ReactNode;
  className?: string;
}

/**
 * Masonry editorial grid with varied card sizes for newspaper aesthetic
 * Dividing lines handled by grid divide utilities (not card borders)
 * Uses CSS Grid with auto-flow to create dynamic layouts
 * Responsive: 1 column mobile → 2 columns tablet → 4 columns desktop
 */
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
        divide-[var(--color-paper-border)]
        border-[var(--color-paper-border)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
