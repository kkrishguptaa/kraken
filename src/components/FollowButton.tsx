"use client";

import { clsx } from "clsx";
import { useState, useTransition } from "react";
import { toggleFollow } from "@/app/actions/social";

interface FollowButtonProps {
  followerId?: string;
  publicationId: string;
  initialFollowing: boolean;
}

export default function FollowButton({
  followerId,
  publicationId,
  initialFollowing,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    if (!followerId) {
      alert("Please sign in to follow this publication.");
      return;
    }

    startTransition(async () => {
      setFollowing(!following);
      await toggleFollow(followerId, publicationId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleFollow}
      disabled={isPending}
      className={clsx(
        "px-8 py-2 no-round font-medium transition-colors border border-ink-border",
        following ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-zinc-100",
      )}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
