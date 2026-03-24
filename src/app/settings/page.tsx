import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import DomainSettingsForm from "@/components/DomainSettingsForm";
import PageWrapper from "@/components/PageWrapper";
import { db } from "@/db";
import { publications } from "@/db/schema";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const publication = await db.query.publications.findFirst({
    where: eq(publications.userId, userId),
  });

  if (!publication) {
    redirect("/onboarding");
  }

  return (
    <PageWrapper className="max-w-4xl py-12">
      <header className="mb-12">
        <h1 className="text-4xl italic font-serif mb-2">Settings</h1>
        <p className="text-muted-ink">
          Manage your publication and custom domains.
        </p>
      </header>

      <div className="space-y-12">
        <section>
          <h2 className="text-xs font-sans uppercase tracking-[0.2em] font-bold border-b border-ink-border pb-2 mb-6 text-muted-ink">
            Custom Domain
          </h2>
          <div className="border border-ink-border p-8 no-round bg-[#FDFCFB]">
            <DomainSettingsForm
              publicationId={publication.id}
              initialDomain={publication.customDomain || ""}
              isVerified={publication.customDomainVerified || false}
            />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-sans uppercase tracking-[0.2em] font-bold border-b border-ink-border pb-2 mb-6 text-muted-ink text-red-600">
            Danger Zone
          </h2>
          <div className="border border-red-200 p-8 no-round bg-red-50">
            <h3 className="text-lg font-serif mb-4">Delete Publication</h3>
            <p className="text-sm text-red-800 mb-6">
              This action is permanent and will delete all issues, subscribers,
              and comments.
            </p>
            <button
              type="button"
              className="bg-red-600 text-white px-8 py-2 no-round font-medium hover:bg-red-700 transition-colors"
            >
              Delete Forever
            </button>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
