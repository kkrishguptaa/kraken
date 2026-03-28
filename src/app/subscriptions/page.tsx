import { and, desc, eq } from "drizzle-orm";
import {
  removeSubscription,
  subscribeToPublication,
  updateSubscriptionNotifications,
} from "@/actions/subscription-actions";
import { Masthead } from "@/components/editorial";
import { Button } from "@/components/ui/button";
import { publications, subscribers, user } from "@/db/schema";
import { useOnboarded } from "@/hooks/onboarded";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const statusCopy: Record<string, string> = {
  subscribed: "Subscription added successfully.",
  "check-email": "Check your inbox and confirm to activate your subscription.",
  updated: "Subscription preferences updated.",
  removed: "Subscription removed.",
  unsubscribed: "Email notifications disabled from your unsubscribe link.",
  "email-unavailable":
    "We saved the subscription, but email delivery is unavailable right now. Try again in a moment.",
  "publication-not-found": "We could not find that publication username.",
  "missing-publication": "Please enter a publication username.",
  "missing-email": "Please enter a valid email address.",
  "invalid-subscriber": "Could not update that subscription.",
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function SubscriptionsPage({ searchParams }: PageProps) {
  const session = await useOnboarded();
  const { status } = await searchParams;

  const rows = await db
    .select({
      id: subscribers.id,
      emailNotificationsEnabled: subscribers.emailNotificationsEnabled,
      publicationName: publications.name,
      publicationUsername: user.username,
      createdAt: subscribers.createdAt,
    })
    .from(subscribers)
    .innerJoin(publications, eq(subscribers.publicationId, publications.id))
    .innerJoin(user, eq(publications.userId, user.id))
    .where(
      and(
        eq(subscribers.userId, session.user.id),
        eq(subscribers.email, session.user.email),
      ),
    )
    .orderBy(desc(subscribers.createdAt));

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

        <section className="max-w-4xl space-y-8 pb-12">
          <header className="space-y-3 border-b border-paper-border pb-6">
            <p className="text-meta text-paper-muted">Reader Desk</p>
            <h1 className="text-headline text-paper-ink">Subscriptions</h1>
            <p className="text-body-editorial text-paper-muted">
              Manage which publications you receive in your inbox.
            </p>
          </header>

          {notice ? (
            <div className="border border-paper-border bg-white/70 px-4 py-3 text-sm text-paper-ink">
              {notice}
            </div>
          ) : null}

          <form
            action={subscribeToPublication}
            className="space-y-4 border border-paper-border bg-white/60 p-6"
          >
            <input type="hidden" name="returnTo" value="/subscriptions" />
            <h2 className="font-family-display text-2xl leading-tight text-paper-ink">
              Add subscription
            </h2>
            <p className="text-body-editorial text-paper-muted">
              Subscribe to a writer by username.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor="publicationUsername">
                Publication username
              </label>
              <input
                id="publicationUsername"
                name="publicationUsername"
                placeholder="@username"
                className="w-full border border-paper-border bg-paper-base px-3 py-2 text-body-editorial text-paper-ink outline-none focus:border-paper-accent"
              />
              <Button variant="primary" className="text-sm">
                Subscribe
              </Button>
            </div>
          </form>

          {rows.length === 0 ? (
            <div className="border border-paper-border bg-white/60 p-8">
              <h2 className="font-family-display text-2xl leading-tight text-paper-ink">
                No active subscriptions yet.
              </h2>
              <p className="mt-3 text-body-editorial text-paper-muted">
                Add a username above to subscribe and receive issue emails.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="space-y-3 border border-paper-border bg-white/60 p-5"
                >
                  <div className="space-y-1">
                    <h2 className="font-family-display text-2xl leading-tight text-paper-ink">
                      {row.publicationName}
                    </h2>
                    <p className="text-sm text-paper-muted">
                      @{row.publicationUsername}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <form action={updateSubscriptionNotifications}>
                      <input type="hidden" name="subscriberId" value={row.id} />
                      <input
                        type="hidden"
                        name="enabled"
                        value={row.emailNotificationsEnabled ? "false" : "true"}
                      />
                      <Button variant="secondary" className="text-sm">
                        {row.emailNotificationsEnabled
                          ? "Disable emails"
                          : "Enable emails"}
                      </Button>
                    </form>

                    <form action={removeSubscription}>
                      <input type="hidden" name="subscriberId" value={row.id} />
                      <Button variant="danger" className="text-sm">
                        Unsubscribe
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
