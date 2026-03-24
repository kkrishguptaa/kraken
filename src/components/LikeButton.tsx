"use client";

import { clsx } from "clsx";
import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleLike } from "@/app/actions/social";

interface LikeButtonProps {
  userId?: string;
  issueId: string;
  initialLiked: boolean;
  count: number;
}

export default function LikeButton({
  userId,
  issueId,
  initialLiked,
  count,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(count);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    if (!userId) {
      alert("Please sign in to like this edition.");
      return;
    }

    startTransition(async () => {
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      await toggleLike(userId, issueId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={isPending}
      className={clsx(
        "flex items-center gap-2 px-6 py-2 no-round font-medium transition-colors border border-ink-border",
        liked ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-zinc-100",
      )}
    >
      <Heart size={16} className={clsx(liked && "fill-current")} />
      <span>
        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
      </span>
    </button>
  );
}
