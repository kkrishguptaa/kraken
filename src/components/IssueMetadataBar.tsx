"use client";

import { useState } from "react";
import { saveIssue } from "@/app/actions/issues";

interface IssueMetadataBarProps {
  issueId: string;
  initialTitle: string;
  initialEditionNumber: number;
}

export default function IssueMetadataBar({
  issueId,
  initialTitle,
  initialEditionNumber,
}: IssueMetadataBarProps) {
  const [title, setTitle] = useState(initialTitle);
  const [editionNumber, setEditionNumber] = useState(initialEditionNumber);

  const handleBlur = async () => {
    await saveIssue(issueId, { title, editionNumber });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 border border-ink-border bg-[#FDFCFB] no-round">
      <div className="flex-1">
        <label
          htmlFor="issue-title"
          className="block text-[10px] uppercase tracking-widest text-muted-ink mb-1"
        >
          Issue Title
        </label>
        <input
          id="issue-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          className="w-full bg-transparent border-none p-0 text-2xl font-serif focus:ring-0 placeholder:italic"
          placeholder="Enter issue title..."
        />
      </div>
      <div className="w-32">
        <label
          htmlFor="edition-number"
          className="block text-[10px] uppercase tracking-widest text-muted-ink mb-1"
        >
          Edition No.
        </label>
        <input
          id="edition-number"
          type="number"
          value={editionNumber}
          onChange={(e) =>
            setEditionNumber(Number.parseInt(e.target.value, 10) || 0)
          }
          onBlur={handleBlur}
          className="w-full bg-transparent border-none p-0 text-2xl font-serif focus:ring-0"
        />
      </div>
    </div>
  );
}
