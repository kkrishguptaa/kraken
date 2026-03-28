"use client";

import { Menu } from "@base-ui/react/menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "./UserAvatar";

interface AvatarMenuProps {
  userName: string;
  userImage?: string | null;
  userUsername?: string | null;
  size?: "small" | "medium" | "large";
}

export function AvatarMenu({
  userName,
  userImage,
  userUsername,
  size = "large",
}: AvatarMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    // biome-ignore lint/a11y/useSemanticElements: Next.Js doesn't allow buttons inside buttons or something
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      role="button"
      tabIndex={0}
    >
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
            <Menu.Popup className="min-w-[180px] bg-paper-base border border-paper-border shadow-lg">
                <Link
                  href={userUsername ? `/@${userUsername}` : "/feed"}
                  className="block w-full"
                >
              <Menu.Item className="px-4 py-3 text-body-editorial text-paper-ink hover:bg-paper-border cursor-pointer transition-colors border-t border-paper-border">
                  Profile
              </Menu.Item>
                </Link>

                <Link href="/feed" className="block w-full">
              <Menu.Item className="px-4 py-3 text-body-editorial text-paper-ink hover:bg-paper-border cursor-pointer transition-colors border-t border-paper-border">
                  Feed
              </Menu.Item>
                </Link>

                <Link href="/subscriptions" className="block w-full">
              <Menu.Item className="px-4 py-3 text-body-editorial text-paper-ink hover:bg-paper-border cursor-pointer transition-colors border-t border-paper-border">
                  Subscriptions
              </Menu.Item>
                </Link>

                <Link href="/editorial" className="block w-full">
              <Menu.Item className="px-4 py-3 text-body-editorial text-paper-ink hover:bg-paper-border cursor-pointer transition-colors">
                  Editorial
              </Menu.Item>
                </Link>

                <Link href="/settings" className="block w-full">
              <Menu.Item className="px-4 py-3 text-body-editorial text-paper-ink hover:bg-paper-border cursor-pointer transition-colors border-t border-paper-border">
                  Settings
              </Menu.Item>
                </Link>

              <Menu.Item className="px-4 py-3 text-body-editorial text-paper-ink hover:bg-paper-border cursor-pointer transition-colors border-t border-paper-border">
                <button
                  onClick={() => {
                    authClient.signOut();
                    router.push("/auth/sign-in");
                  }}
                  type="button"
                  className="block w-full text-left"
                >
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
