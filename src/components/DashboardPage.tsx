"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createIssue } from "@/app/actions/issues";
import type { issues as issuesTable } from "@/db/schema";
import IssueCard from "./IssueCard";

interface DashboardProps {
  publication: {
    id: string;
    name: string;
    slug: string;
  };
  issues: (typeof issuesTable.$inferSelect)[];
}

export default function DashboardPage({
  publication,
  issues: userIssues,
}: DashboardProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateIssue = async () => {
    setIsCreating(true);
    const newIssue = await createIssue(publication.id);
    router.push(`/editor/${newIssue.id}`);
  };

  const drafts = userIssues.filter((i) => i.status === "draft");
  const published = userIssues.filter((i) => i.status === "published");

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center pb-4 border-b border-ink-border mb-12">
        <h1 className="text-4xl italic font-serif uppercase tracking-tight">
          {publication.name} — Editor
        </h1>
        <div className="flex items-center gap-6">
          <a
            href={`/@${publication.slug}`}
            className="text-xs font-sans uppercase tracking-widest hover:underline"
          >
            View Publication
          </a>
          <UserButton />
        </div>
      </header>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif">Workspace</h2>
        <button
          type="button"
          onClick={handleCreateIssue}
          disabled={isCreating}
          className="bg-ink text-paper px-8 py-2 no-round font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          {isCreating ? "Preparing Edition..." : "New Issue"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Drafts Column */}
        <div className="md:col-span-1">
          <h3 className="text-xs font-sans uppercase tracking-[0.2em] font-bold border-b border-ink-border pb-2 mb-6 text-muted-ink">
            Draft Editions
          </h3>
          <div className="space-y-6">
            {drafts.length === 0 ? (
              <p className="italic text-muted-ink font-serif text-sm">
                No drafts in the inkwell.
              </p>
            ) : (
              drafts.map((issue) => (
                <div
                  key={issue.id}
                  className="border border-ink-border p-4 no-round bg-[#FDFCFB] group relative"
                >
                  <span className="text-[10px] font-sans text-muted-ink block mb-1">
                    EDITION #{issue.editionNumber}
                  </span>
                  <a
                    href={`/editor/${issue.id}`}
                    className="font-serif text-lg leading-tight group-hover:underline block"
                  >
                    {issue.title || "Untitled Edition"}
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Published Column */}
        <div className="md:col-span-2">
          <h3 className="text-xs font-sans uppercase tracking-[0.2em] font-bold border-b border-ink-border pb-2 mb-6 text-muted-ink">
            Sent to Press
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {published.length === 0 ? (
              <p className="italic text-muted-ink font-serif text-sm">
                Nothing published yet.
              </p>
            ) : (
              published.map((issue) => (
                <IssueCard
                  key={issue.id}
                  slug={publication.slug}
                  editionNumber={issue.editionNumber}
                  title={issue.title}
                  date={new Date(issue.publishedAt as Date).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                  excerpt={issue.content.substring(0, 150)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
