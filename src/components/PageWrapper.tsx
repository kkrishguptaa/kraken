import type { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function PageWrapper({
  children,
  className = "",
}: PageWrapperProps) {
  return (
    <div
      className={`min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`}
    >
      {children}
    </div>
  );
}
