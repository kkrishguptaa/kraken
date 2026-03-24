"use client";

import { MessageSquare } from "lucide-react";
import { useState, useTransition } from "react";
import { addComment } from "@/app/actions/social";

import type {
  comments as commentsTable,
  users as usersTable,
} from "@/db/schema";

interface CommentSectionProps {
  userId?: string;
  issueId: string;
  comments: (typeof commentsTable.$inferSelect & {
    user: typeof usersTable.$inferSelect;
  })[];
}

export default function CommentSection({
  userId,
  issueId,
  comments: initialComments,
}: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("Please sign in to comment.");
      return;
    }
    if (!content.trim()) return;

    startTransition(async () => {
      await addComment(userId, issueId, content);
      setContent("");
    });
  };

  return (
    <div className="mt-12">
      <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
        <MessageSquare size={20} />
        Comments ({initialComments.length})
      </h3>

      <div className="space-y-8 mb-12">
        {initialComments.length === 0 ? (
          <p className="italic text-muted-ink font-serif text-sm">
            No comments yet. Start the conversation.
          </p>
        ) : (
          initialComments.map((comment) => (
            <div
              key={comment.id}
              className="border-l-2 border-ink-border pl-6 py-2"
            >
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-sans font-bold text-xs uppercase tracking-wider">
                  {comment.user.username}
                </span>
                <span className="text-[10px] font-sans text-muted-ink">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="font-serif text-sm leading-relaxed text-ink">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleComment}
        className="border border-ink-border p-6 no-round bg-[#FDFCFB]"
      >
        <label
          htmlFor="comment-textarea"
          className="block text-xs font-sans uppercase tracking-[0.2em] font-bold mb-4"
        >
          Write a comment
        </label>
        <textarea
          id="comment-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full border border-ink-border p-4 no-round font-serif text-sm h-32 resize-none focus:outline-none focus:ring-1 focus:ring-ink mb-4"
        />
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="bg-ink text-paper px-8 py-2 no-round font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          {isPending ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}
