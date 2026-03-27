"use client";

import { Menu } from "@base-ui/react/menu";
import Link from "next/link";
import { useState } from "react";
import { UserAvatar } from "./UserAvatar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from 'next/navigation'

interface AvatarMenuProps {
  userName: string;
  userImage?: string | null;
  userUsername?: string | null;
  size?: "small" | "medium" | "large";
}

/**
 * Avatar with hoverable dropdown menu
 * Shows Editorial, Profile, Subscriptions, Settings, Logout on hover
 * Displays user's image if available, otherwise shows initials
 */
export function AvatarMenu({ userName, userImage, userUsername, size = "large" }: AvatarMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: I did not find any interactive tag suitable for the avatar trigger, and the menu library requires a single child for the trigger, so I wrapped it in a div with mouse events to control the menu open state.
<div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Avatar trigger */}
      <Menu.Root open={open} onOpenChange={setOpen}>
        <Menu.Trigger className="cursor-pointer">
          <UserAvatar name={userName} image={userImage} size={size} />
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Positioner
            side="bottom"
            align="end"
            sideOffset={8}
            className="z-50"
          >
            <Menu.Popup className="min-w-[180px] bg-[var(--color-paper-base)] border border-[var(--color-paper-border)] shadow-lg">

              {/* Profile */}
              <Menu.Item className="px-4 py-3 text-body-editorial text-[var(--color-paper-ink)] hover:bg-[var(--color-paper-border)] cursor-pointer transition-colors border-t border-[var(--color-paper-border)]">
                <Link href={userUsername ? `/@${userUsername}` : "/profile"} className="block w-full">
                  Profile
                </Link>
              </Menu.Item>

              {/* Subscriptions */}
              <Menu.Item className="px-4 py-3 text-body-editorial text-[var(--color-paper-ink)] hover:bg-[var(--color-paper-border)] cursor-pointer transition-colors border-t border-[var(--color-paper-border)]">
                <Link href="/subscriptions" className="block w-full">
                  Subscriptions
                </Link>
              </Menu.Item>

              {/* Editorial */}
              <Menu.Item className="px-4 py-3 text-body-editorial text-[var(--color-paper-ink)] hover:bg-[var(--color-paper-border)] cursor-pointer transition-colors">
                <Link href="/editorial" className="block w-full">
                  Editorial
                </Link>
              </Menu.Item>

              {/* Settings */}
              <Menu.Item className="px-4 py-3 text-body-editorial text-[var(--color-paper-ink)] hover:bg-[var(--color-paper-border)] cursor-pointer transition-colors border-t border-[var(--color-paper-border)]">
                <Link href="/settings" className="block w-full">
                  Settings
                </Link>
              </Menu.Item>

              {/* Logout */}
              <Menu.Item className="px-4 py-3 text-body-editorial text-[var(--color-paper-ink)] hover:bg-[var(--color-paper-border)] cursor-pointer transition-colors border-t border-[var(--color-paper-border)]">
                  <button onClick={() => {
                    authClient.signOut()
                    router.refresh()
                  }} type="submit" className="block w-full text-left">
                    Logout
                  </button>
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
}
