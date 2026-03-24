import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { publishIssue, saveIssue } from "@/app/actions/issues";
import Editor from "@/components/Editor";
import IssueMetadataBar from "@/components/IssueMetadataBar";
import PageWrapper from "@/components/PageWrapper";
import TemplateManager from "@/components/TemplateManager";
import { db } from "@/db";
import { issues, templates } from "@/db/schema";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  const { userId } = await auth();
  const { issueId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const issue = await db.query.issues.findFirst({
    where: eq(issues.id, issueId),
    with: {
      publication: true,
    },
  });

  if (!issue) {
    notFound();
  }

  // Verify ownership
  if (issue.publication.userId !== userId) {
    redirect("/");
  }

  const userTemplates = await db.query.templates.findMany({
    where: eq(templates.publicationId, issue.publication.id),
  });

  const handleSave = async (content: string) => {
    "use server";
    await saveIssue(issueId, { content });
  };

  const handlePublish = async () => {
    "use server";
    await publishIssue(issueId);
  };

  return (
    <PageWrapper className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-sm font-sans uppercase tracking-[0.2em] text-muted-ink">
          Drafting: {issue.publication.name}
        </h1>
        <div className="flex gap-4">
          <a
            href="/"
            className="text-sm font-sans text-muted-ink hover:text-ink"
          >
            Back to Dashboard
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <IssueMetadataBar
            issueId={issueId}
            initialTitle={issue.title}
            initialEditionNumber={issue.editionNumber}
          />

          <div className="h-[calc(100vh-450px)] min-h-[600px]">
            <Editor
              initialContent={issue.content}
              onSave={handleSave}
              onPublish={handlePublish}
              status={issue.status as "draft" | "published"}
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <TemplateManager
            publicationId={issue.publication.id}
            templates={userTemplates}
            currentContent={issue.content}
            onApply={async (content) => {
              "use server";
              await saveIssue(issueId, { content });
            }}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
