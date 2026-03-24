"use client";

import { Check, Copy, MessageSquare } from "lucide-react";
import { useState } from "react";

interface ShareBarProps {
  publicationName: string;
  issueTitle: string;
  editionNumber: number;
  date: string;
  content: string;
  url: string;
}

export default function ShareBar({
  publicationName,
  issueTitle,
  editionNumber,
  date,
  content,
  url,
}: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const convertToSlackMarkdown = () => {
    let slackMarkdown = `🔗 Read on Kraken News: ${url}\n\n`;
    slackMarkdown += `📰 *${publicationName} — Edition #${editionNumber}*\n`;
    slackMarkdown += `_${issueTitle} · ${date}_\n\n`;
    slackMarkdown += `---\n\n`;

    // Basic markdown conversion
    const body = content
      .replace(/^# (.*$)/gm, "*$1*") // H1 to bold
      .replace(/^## (.*$)/gm, "*$1*") // H2 to bold
      .replace(/^### (.*$)/gm, "*$1*") // H3 to bold
      .replace(/\*\*(.*?)\*\*/g, "*$1*") // Bold to bold (Slack uses single * for bold)
      .replace(/\*(.*?)\*/g, "_$1_") // Italic to italic (Slack uses _)
      .replace(/^> (.*$)/gm, "> $1") // Blockquote
      .replace(/\[(.*?)\]\((.*?)\)/g, "<$2|$1>"); // Links

    slackMarkdown += body;

    navigator.clipboard.writeText(slackMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-4 py-8 border-y border-ink-border my-12">
      <span className="text-xs font-sans uppercase tracking-[0.2em] font-bold text-muted-ink">
        Share this Edition
      </span>
      <button
        type="button"
        onClick={convertToSlackMarkdown}
        className="flex items-center gap-2 px-4 py-2 border border-ink-border no-round text-xs font-sans uppercase tracking-widest hover:bg-zinc-100 transition-colors"
      >
        {copied ? (
          <Check size={14} className="text-green-600" />
        ) : (
          <MessageSquare size={14} />
        )}
        {copied ? "Copied to Clipboard" : "Copy for Slack / Discord"}
      </button>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="flex items-center gap-2 px-4 py-2 border border-ink-border no-round text-xs font-sans uppercase tracking-widest hover:bg-zinc-100 transition-colors"
      >
        <Copy size={14} />
        Copy Link
      </button>
    </div>
  );
}
