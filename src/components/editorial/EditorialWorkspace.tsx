"use client";

import Link from "next/link";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { useMemo, useState, useTransition } from "react";
import {
  createEditorialDraft,
  publishEditorialIssue,
  saveEditorialIssue,
  testSendIssueEmail,
  type EditorialIssueRecord,
} from "@/actions/editorial-actions";

type EditorialWorkspaceProps = {
  username: string;
  initialIssues: EditorialIssueRecord[];
};

function formatStamp(value: Date | null): string {
  if (!value) {
    return "Never";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function EditorialWorkspace({ username, initialIssues }: EditorialWorkspaceProps) {
  const [issues, setIssues] = useState(initialIssues);
  const [activeIssueId, setActiveIssueId] = useState<string | null>(
    initialIssues[0]?.id ?? null,
  );
  const [title, setTitle] = useState(initialIssues[0]?.title ?? "");
  const [content, setContent] = useState(initialIssues[0]?.content ?? "");
  const [notice, setNotice] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const activeIssue = useMemo(
    () => issues.find((issue) => issue.id === activeIssueId) ?? null,
    [issues, activeIssueId],
  );

  const draftIssues = useMemo(
    () => issues.filter((issue) => issue.status === "draft"),
    [issues],
  );
  const publishedIssues = useMemo(
    () => issues.filter((issue) => issue.status === "published"),
    [issues],
  );

  const toolbarCommands = useMemo(
    () => [
      commands.bold,
      commands.italic,
      commands.strikethrough,
      commands.hr,
      commands.divider,
      commands.title,
      commands.quote,
      commands.unorderedListCommand,
      commands.orderedListCommand,
      commands.link,
      commands.code,
      commands.codeBlock,
    ],
    [],
  );

  function selectIssue(issue: EditorialIssueRecord) {
    setActiveIssueId(issue.id);
    setTitle(issue.title);
    setContent(issue.content);
    setNotice("");
  }

  function handleCreateDraft() {
    startTransition(async () => {
      try {
        const created = await createEditorialDraft();
        setIssues((prev) => [created, ...prev]);
        selectIssue(created);
        setNotice("New draft created.");
      } catch {
        setNotice("Could not create draft.");
      }
    });
  }

  function handleSave() {
    if (!activeIssue) {
      return;
    }

    startTransition(async () => {
      try {
        const saved = await saveEditorialIssue({
          issueId: activeIssue.id,
          title: title.trim() || "Untitled Draft",
          content,
        });

        setIssues((prev) =>
          prev.map((issue) => (issue.id === saved.id ? saved : issue)),
        );
        selectIssue(saved);
        setNotice(
          saved.status === "published"
            ? "Published issue updated."
            : "Draft saved.",
        );
      } catch {
        setNotice("Could not save changes.");
      }
    });
  }

  function handlePublish() {
    if (!activeIssue) {
      return;
    }

    startTransition(async () => {
      try {
        const published = await publishEditorialIssue({
          issueId: activeIssue.id,
          title: title.trim() || "Untitled Issue",
          content,
        });

        setIssues((prev) =>
          prev.map((issue) => (issue.id === published.id ? published : issue)),
        );
        selectIssue(published);
        setNotice("Issue published.");
      } catch {
        setNotice("Could not publish issue.");
      }
    });
  }

  function handleTestSend() {
    if (!activeIssue) {
      return;
    }

    startTransition(async () => {
      try {
        await testSendIssueEmail({
          issueId: activeIssue.id,
          title: title.trim() || "Untitled Issue",
          content,
        });
        setNotice("Test email sent to your inbox.");
      } catch {
        setNotice("Could not send test email.");
      }
    });
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <aside className="space-y-6 border border-paper-border bg-white/60 p-5 lg:sticky lg:top-8 lg:h-fit">
        <div className="space-y-3">
          <p className="text-meta text-paper-muted">Issue Archive</p>
          <button
            type="button"
            onClick={handleCreateDraft}
            disabled={isPending}
            className="w-full border border-paper-ink px-4 py-2 text-meta-small text-paper-ink transition hover:bg-paper-ink hover:text-paper-base disabled:opacity-60"
          >
            New draft
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-meta-small text-paper-muted">Drafts</p>
          {draftIssues.length === 0 ? (
            <p className="text-sm text-paper-muted">No drafts yet.</p>
          ) : (
            draftIssues.map((issue) => (
              <button
                key={issue.id}
                type="button"
                onClick={() => selectIssue(issue)}
                className={`w-full border px-3 py-2 text-left transition ${
                  issue.id === activeIssueId
                    ? "border-paper-ink bg-paper-border/50"
                    : "border-paper-border hover:bg-paper-border/40"
                }`}
              >
                <p className="line-clamp-2 text-body-editorial text-paper-ink">
                  {issue.title || "Untitled Draft"}
                </p>
                <p className="mt-1 text-meta-small text-paper-muted">
                  Ed. #{issue.editionNumber}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="space-y-2">
          <p className="text-meta-small text-paper-muted">Published</p>
          {publishedIssues.length === 0 ? (
            <p className="text-sm text-paper-muted">Nothing published yet.</p>
          ) : (
            publishedIssues.map((issue) => (
              <button
                key={issue.id}
                type="button"
                onClick={() => selectIssue(issue)}
                className={`w-full border px-3 py-2 text-left transition ${
                  issue.id === activeIssueId
                    ? "border-paper-ink bg-paper-border/50"
                    : "border-paper-border hover:bg-paper-border/40"
                }`}
              >
                <p className="line-clamp-2 text-body-editorial text-paper-ink">
                  {issue.title || "Untitled Issue"}
                </p>
                <p className="mt-1 text-meta-small text-paper-muted">
                  Published {formatStamp(issue.publishedAt)}
                </p>
              </button>
            ))
          )}
        </div>
      </aside>

      <div className="space-y-5 border border-paper-border bg-white/60 p-6 lg:p-8">
        {activeIssue ? (
          <>
            <header className="space-y-3 border-b border-paper-border pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-meta text-paper-muted">
                  Edition #{activeIssue.editionNumber}
                </p>
                <p className="text-meta-small text-paper-muted">
                  Last updated {formatStamp(activeIssue.updatedAt)}
                </p>
              </div>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Issue title"
                className="w-full border border-paper-border bg-paper-base px-3 py-2 font-family-display text-[clamp(1.4rem,3vw,2rem)] text-paper-ink outline-none focus:border-paper-accent"
              />
            </header>

            <div data-color-mode="light">
              <MDEditor
                value={content}
                onChange={(nextValue) => setContent(nextValue ?? "")}
                preview="edit"
                visibleDragbar={false}
                height={480}
                textareaProps={{
                  placeholder: "Write your issue here...",
                }}
                commands={toolbarCommands}
                extraCommands={[]}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-paper-border pt-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="border border-paper-ink px-4 py-2 text-meta-small text-paper-ink transition hover:bg-paper-ink hover:text-paper-base disabled:opacity-60"
              >
                {activeIssue.status === "published"
                  ? "Save published changes"
                  : "Save draft"}
              </button>

              <button
                type="button"
                onClick={handleTestSend}
                disabled={isPending}
                className="border border-paper-border px-4 py-2 text-meta-small text-paper-ink transition hover:bg-paper-border disabled:opacity-60"
              >
                Test send to me
              </button>

              {activeIssue.status === "draft" ? (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPending}
                  className="border border-paper-border px-4 py-2 text-meta-small text-paper-ink transition hover:bg-paper-border disabled:opacity-60"
                >
                  Publish issue
                </button>
              ) : (
                <span className="text-meta-small text-paper-muted">Published</span>
              )}

              {activeIssue.status === "published" ? (
                <Link
                  href={`/@${username}/${activeIssue.editionNumber}`}
                  className="text-meta-small underline underline-offset-2"
                >
                  View published page
                </Link>
              ) : null}

              {notice ? (
                <p className="ml-auto text-meta-small text-paper-muted">{notice}</p>
              ) : null}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <h2 className="text-headline text-paper-ink">Start writing</h2>
            <p className="text-body-editorial text-paper-muted">
              Create your first draft from the left sidebar.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
