import { eq } from "drizzle-orm";
import Link from "next/link";
import {
  addCustomDomain,
  removeCustomDomain,
  updateDisplayName,
  updatePublicationTitle,
  verifyCustomDomain,
} from "@/actions/settings-actions";
import { Masthead } from "@/components/editorial";
import { publications } from "@/db/schema";
import { useOnboarded } from "@/hooks/onboarded";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const statusCopy: Record<string, string> = {
  "name-updated": "Name updated.",
  "invalid-name": "Name must be at least 2 characters.",
  "publication-title-updated": "Publication title updated.",
  "invalid-publication-title":
    "Publication title must be at least 2 characters.",
  "domain-added": "Custom domain added and verified.",
  "domain-pending-verification":
    "Domain added. Complete DNS verification and click Verify.",
  "domain-verified": "Domain verified successfully.",
  "domain-removed": "Custom domain removed.",
  "domain-add-failed": "Could not add domain on Vercel.",
  "domain-verify-failed": "Could not verify domain yet.",
  "invalid-domain": "Please enter a valid domain.",
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function SettingsPage({ searchParams }: PageProps) {
  const session = await useOnboarded();
  const { status } = await searchParams;

  const publication = await db
    .select({
      id: publications.id,
      name: publications.name,
      customDomain: publications.customDomain,
      customDomainVerified: publications.customDomainVerified,
    })
    .from(publications)
    .where(eq(publications.userId, session.user.id))
    .then((rows) => rows[0]);

  const notice = status ? statusCopy[status] : null;

  return (
    <main className="min-h-screen bg-paper-base">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="py-8">
          <Masthead
            userName={session.user.name}
            userImage={session.user.image}
            userUsername={session.user.username}
            showAvatar
            className="mb-8"
          />
        </div>

        <section className="max-w-5xl space-y-8 pb-12">
          <header className="space-y-3 border-b border-paper-border pb-6">
            <p className="text-meta text-paper-muted">Account Desk</p>
            <h1 className="text-headline text-paper-ink">Settings</h1>
            <p className="text-body-editorial text-paper-muted">
              Manage your profile, publication identity, and domain routing.
            </p>
          </header>

          {notice ? (
            <div className="border border-paper-border bg-white/70 px-4 py-3 text-meta-small text-paper-ink">
              {notice}
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2">
            <form
              action={updateDisplayName}
              className="space-y-3 border border-paper-border bg-white/60 p-6"
            >
              <h2 className="font-family-display text-2xl text-paper-ink">
                Profile name
              </h2>
              <p className="text-meta-small text-paper-muted">
                This appears on your profile and bylines.
              </p>
              <input
                name="name"
                defaultValue={session.user.name || ""}
                className="w-full border border-paper-border bg-paper-base px-3 py-2 text-body-editorial text-paper-ink outline-none focus:border-paper-accent"
              />
              <div className="text-meta-small text-paper-muted">
                @{session.user.username}
              </div>
              <button
                type="submit"
                className="border border-paper-ink px-4 py-2 text-meta-small text-paper-ink transition hover:bg-paper-ink hover:text-paper-base"
              >
                Save name
              </button>
            </form>

            <form
              action={updatePublicationTitle}
              className="space-y-3 border border-paper-border bg-white/60 p-6"
            >
              <h2 className="font-family-display text-2xl text-paper-ink">
                Publication title
              </h2>
              <p className="text-meta-small text-paper-muted">
                This becomes the masthead title for /@{session.user.username}.
              </p>
              <input
                name="publicationTitle"
                defaultValue={publication?.name || ""}
                className="w-full border border-paper-border bg-paper-base px-3 py-2 text-body-editorial text-paper-ink outline-none focus:border-paper-accent"
              />
              <button
                type="submit"
                className="border border-paper-ink px-4 py-2 text-meta-small text-paper-ink transition hover:bg-paper-ink hover:text-paper-base"
              >
                Save publication title
              </button>
            </form>
          </div>

          <div className="space-y-4 border border-paper-border bg-white/60 p-6">
            <h2 className="font-family-display text-2xl text-paper-ink">
              Custom domain
            </h2>
            <p className="text-body-editorial text-paper-muted">
              Connect your publication to a custom domain using Vercel Domains
              API.
            </p>

            <form
              action={addCustomDomain}
              className="flex flex-col gap-3 md:flex-row"
            >
              <input
                name="customDomain"
                placeholder="news.example.com"
                defaultValue={publication?.customDomain || ""}
                className="w-full border border-paper-border bg-paper-base px-3 py-2 text-body-editorial text-paper-ink outline-none focus:border-paper-accent"
              />
              <button
                type="submit"
                className="border border-paper-ink px-4 py-2 text-meta-small text-paper-ink transition hover:bg-paper-ink hover:text-paper-base"
              >
                Add domain
              </button>
            </form>

            {publication?.customDomain ? (
              <div className="flex flex-wrap items-center gap-3 text-meta-small text-paper-muted">
                <span>
                  Current: {publication.customDomain} (
                  {publication.customDomainVerified ? "verified" : "pending"})
                </span>

                <form action={verifyCustomDomain}>
                  <input
                    type="hidden"
                    name="customDomain"
                    value={publication.customDomain}
                  />
                  <button
                    type="submit"
                    className="border border-paper-border px-3 py-2 text-meta-small text-paper-ink transition hover:bg-paper-border"
                  >
                    Verify domain
                  </button>
                </form>

                <form action={removeCustomDomain}>
                  <input
                    type="hidden"
                    name="customDomain"
                    value={publication.customDomain}
                  />
                  <button
                    type="submit"
                    className="border border-paper-ink px-3 py-2 text-meta-small text-paper-ink transition hover:bg-paper-ink hover:text-paper-base"
                  >
                    Remove domain
                  </button>
                </form>
              </div>
            ) : null}

            <p className="text-meta-small text-paper-muted">
              Configure DNS records from Vercel's response, then use Verify
              domain.
            </p>
          </div>

          <div className="space-y-4 border border-paper-border bg-white/60 p-6 text-body-editorial text-paper-ink">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-paper-muted">Email</span>
              <span>{session.user.email}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-paper-muted">Public publication</span>
              <Link
                href={`/@${session.user.username}`}
                className="underline underline-offset-4"
              >
                /@{session.user.username}
              </Link>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-paper-muted">Marketing page</span>
              <Link href="/home" className="underline underline-offset-4">
                /home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
