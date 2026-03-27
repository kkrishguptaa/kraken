"use client";

import Image from "next/image";

interface UserAvatarProps {
  name: string;
  image?: string | null;
  size?: "small" | "medium" | "large";
  className?: string;
}

const sizeConfig = {
  small: { pixels: 32, className: "w-8 h-8 text-xs" },
  medium: { pixels: 40, className: "w-10 h-10 text-sm" },
  large: { pixels: 64, className: "w-16 h-16 text-base" },
};

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

export function UserAvatar({
  name,
  image,
  size = "medium",
  className = "",
}: UserAvatarProps) {
  const initials = getInitials(name);
  const config = sizeConfig[size];

  // If user has an image, show it with Next.js Image optimization
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={config.pixels}
        height={config.pixels}
        className={`
          ${config.className}
          ${className}
          rounded-full
          object-cover
          shadow-inner
        `}
      />
    );
  }

  // Otherwise show initials
  return (
    <div
      className={`
        ${config.className}
        ${className}
        rounded-full
        bg-[#9c9485]
        text-white
        flex items-center justify-center
        font-[var(--font-family-ui)]
        font-medium
        tracking-wide
        shadow-inner
      `}
    >
      {initials}
    </div>
  );
}
