type ClassValue = string | false | null | undefined;

export function joinClassNames(...values: ClassValue[]) {
  return values.filter(Boolean).join(" ");
}

export const authInputBaseClassName = joinClassNames(
  "w-full cursor-text border bg-white px-3 py-2 text-sm outline-none transition",
  "border-paper-border text-paper-ink",
  "focus:border-paper-accent focus:ring-2 focus:ring-[rgb(106_64_32_/_0.2)]",
);

export function getAuthInputClassName({
  invalid = false,
  className,
}: {
  invalid?: boolean;
  className?: string;
}) {
  return joinClassNames(
    authInputBaseClassName,
    invalid && "border-red-600 focus:border-red-600 focus:ring-red-200",
    className,
  );
}

export const authSurfaceButtonClassName = joinClassNames(
  "w-full cursor-pointer border border-paper-border bg-white px-4 py-3 text-sm font-medium transition",
  "hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60",
);

export const authPrimaryButtonClassName = joinClassNames(
  "w-full cursor-pointer border border-paper-ink bg-paper-ink px-4 py-3 text-sm font-medium text-paper-base transition",
  "hover:bg-black disabled:cursor-not-allowed disabled:opacity-60",
);

export const authSecondaryButtonClassName = joinClassNames(
  authSurfaceButtonClassName,
  "text-paper-ink",
);

export const authHelpCardClassName =
  "rounded border border-paper-border bg-white p-4";
