import Link from "next/link";
import { subscribeToPublication } from "@/actions/subscription-actions";
import { Button } from "@/components/ui/button";

type SubscriptionBoxProps = {
  publicationUsername: string;
  publicationName: string;
  isAuthenticated: boolean;
  isOwnPublication: boolean;
  isSubscribed: boolean;
  returnTo: string;
  status?: string;
};

export function SubscriptionBox({
  publicationUsername,
  publicationName,
  isAuthenticated,
  isOwnPublication,
  isSubscribed,
  returnTo,
  status,
}: SubscriptionBoxProps) {
  const noticeMap: Record<string, string> = {
    subscribed: "Subscription confirmed. Check your inbox.",
    "check-email":
      "Check your inbox and confirm to activate your subscription.",
    "email-unavailable":
      "Subscription saved, but email delivery is unavailable right now. Try again shortly.",
    "missing-email": "Enter a valid email to subscribe.",
    "publication-not-found": "Publication not found.",
    "missing-publication": "Missing publication username.",
  };

  const notice = status ? noticeMap[status] : null;

  return (
    <section className="border border-paper-border bg-white/60 px-6 py-6 md:px-8">
      <p className="text-meta text-paper-muted">Inbox</p>
      <h2 className="mt-2 font-family-display text-[clamp(1.4rem,2.8vw,2rem)] leading-tight text-paper-ink">
        {publicationName}
      </h2>
      <p className="mt-2 text-body-editorial text-paper-muted">
        Get every new edition in your inbox.
      </p>

      {notice ? <p className="mt-4 text-sm text-paper-ink">{notice}</p> : null}

      <div className="mt-5">
        {isOwnPublication ? (
          <p className="text-sm text-paper-muted">
            This is your publication profile.
          </p>
        ) : null}

        {!isOwnPublication && !isAuthenticated ? (
          <div className="space-y-3">
            <form
              action={subscribeToPublication}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="hidden"
                name="publicationUsername"
                value={publicationUsername}
              />
              <input type="hidden" name="returnTo" value={returnTo} />
              <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                className="w-full border border-paper-border bg-paper-base px-3 py-2 text-body-editorial text-paper-ink outline-none focus:border-paper-accent"
              />
              <Button variant="primary" className="text-sm">
                Subscribe
              </Button>
            </form>
            <p className="text-sm text-paper-muted">
              Already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </div>
        ) : null}

        {!isOwnPublication && isAuthenticated && isSubscribed ? (
          <div className="space-y-2">
            <p className="text-sm text-paper-muted">
              You are subscribed to @{publicationUsername}.
            </p>
            <Link
              href="/subscriptions"
              className="inline-block border border-paper-border px-4 py-2 text-sm text-paper-ink transition hover:bg-paper-border"
            >
              Manage subscriptions
            </Link>
          </div>
        ) : null}

        {!isOwnPublication && isAuthenticated && !isSubscribed ? (
          <form action={subscribeToPublication}>
            <input
              type="hidden"
              name="publicationUsername"
              value={publicationUsername}
            />
            <input type="hidden" name="returnTo" value={returnTo} />
            <Button variant="primary" className="text-sm">
              Subscribe to @{publicationUsername}
            </Button>
          </form>
        ) : null}
      </div>
    </section>
  );
}
