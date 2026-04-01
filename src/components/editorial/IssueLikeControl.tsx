import Link from "next/link";
import { likeIssue, unlikeIssue } from "@/actions/like-actions";
import { Button } from "@/components/ui/button";

interface IssueLikeControlProps {
  issueId: string;
  publicationUsername: string;
  editionNumber: number;
  likeCount: number;
  viewerHasLiked: boolean;
  isAuthenticated: boolean;
  returnTo: string;
  compact?: boolean;
}

export function IssueLikeControl({
  issueId,
  publicationUsername,
  editionNumber,
  likeCount,
  viewerHasLiked,
  isAuthenticated,
  returnTo,
  compact = false,
}: IssueLikeControlProps) {
  const buttonLabel = viewerHasLiked ? "Liked" : "Like";
  const countLabel = `${likeCount} ${likeCount === 1 ? "like" : "likes"}`;

  if (!isAuthenticated) {
    return (
      <div
        className={`flex items-center gap-3 ${
          compact ? "text-xs" : "text-sm"
        } text-paper-muted`}
      >
        <span>{countLabel}</span>
        <Link href="/auth/sign-in" className="underline underline-offset-2">
          Sign in to like
        </Link>
      </div>
    );
  }

  return (
    <form
      action={viewerHasLiked ? unlikeIssue : likeIssue}
      className="flex items-center gap-3"
    >
      <input type="hidden" name="issueId" value={issueId} />
      <input
        type="hidden"
        name="publicationUsername"
        value={publicationUsername}
      />
      <input type="hidden" name="editionNumber" value={editionNumber} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <Button
        variant={viewerHasLiked ? "secondary" : "underline"}
        className={compact ? "px-0 py-0 text-xs" : "px-0 py-0 text-sm"}
      >
        {buttonLabel}
      </Button>
      <span
        className={
          compact ? "text-xs text-paper-muted" : "text-sm text-paper-muted"
        }
      >
        {countLabel}
      </span>
    </form>
  );
}
