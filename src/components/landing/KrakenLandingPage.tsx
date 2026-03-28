import Link from "next/link";

type SessionLike = {
  user?: {
    username?: string | null;
  } | null;
} | null;

interface KrakenLandingPageProps {
  session?: SessionLike;
}

export function KrakenLandingPage({ session = null }: KrakenLandingPageProps) {
  const isSignedIn = Boolean(session);
  const publicationHref = session?.user?.username
    ? `/@${session.user.username}`
    : "/auth/sign-up";

  return (
    <main className="min-h-screen bg-paper-base">
      {/* Masthead Navigation */}
      <nav className="border-b-2 border-paper-ink">
        <div className="mx-auto max-w-[1200px] px-8 py-6 md:px-12 lg:px-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              <h1 className="font-family-display text-2xl tracking-tight text-paper-ink">
                KRAKEN
              </h1>
              <span className="text-meta-small text-paper-muted">
                Editorial Platform
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-meta-small text-paper-ink">
              <Link
                href="/feed"
                className="hover:text-paper-accent transition-colors"
              >
                FEED
              </Link>
              <Link
                href="/subscriptions"
                className="hover:text-paper-accent transition-colors"
              >
                SUBSCRIPTIONS
              </Link>
              <Link
                href={isSignedIn ? "/editorial" : "/auth/sign-in"}
                className="hover:text-paper-accent transition-colors"
              >
                {isSignedIn ? "EDITORIAL" : "SIGN IN"}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-paper-border">
        <div className="mx-auto max-w-[1200px] px-8 py-20 md:px-12 md:py-32 lg:px-16 lg:py-40">
          <div className="mx-auto max-w-[900px] space-y-12">
            <div className="space-y-8">
              <p className="text-meta text-paper-muted tracking-widest">
                EDITION NO. 001 — MARCH 2026
              </p>

              <h2 className="font-family-display text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.88] tracking-[-0.045em] text-paper-ink">
                Your personal paper, published on your own cadence.
              </h2>

              <p className="max-w-[680px] text-[1.35rem] leading-[1.65] text-paper-muted md:text-[1.5rem] md:leading-[1.7]">
                Kraken turns daily notes, weekly letters, and monthly essays
                into an editorial publication people can follow in the feed,
                read on the web, and receive by email.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href={isSignedIn ? "/editorial" : "/auth/sign-up"}
                className="inline-flex items-center justify-center bg-paper-ink px-8 py-4 text-meta-small tracking-wider text-paper-base transition-all hover:bg-paper-accent"
              >
                {isSignedIn
                  ? "WRITE YOUR NEXT EDITION"
                  : "START YOUR PUBLICATION"}
              </Link>
              <Link
                href={isSignedIn ? publicationHref : "/feed"}
                className="inline-flex items-center justify-center px-8 py-4 text-meta-small tracking-wider text-paper-ink underline decoration-1 underline-offset-4 transition-colors hover:text-paper-accent"
              >
                {isSignedIn
                  ? "VISIT YOUR PUBLICATION"
                  : "BROWSE PUBLIC EDITIONS"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Column Features */}
      <section className="border-b border-paper-border">
        <div className="mx-auto max-w-[1200px] px-8 py-20 md:px-12 md:py-24 lg:px-16">
          <div className="grid gap-16 md:grid-cols-3 md:gap-12">
            <div className="space-y-4">
              <p className="text-meta text-paper-muted tracking-widest">
                CADENCE
              </p>
              <p className="text-[1.125rem] leading-[1.6] text-paper-ink">
                Daily, weekly, monthly, or whenever a real update is ready. No
                pressure to perform on someone else's schedule.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-meta text-paper-muted tracking-widest">
                DISTRIBUTION
              </p>
              <p className="text-[1.125rem] leading-[1.6] text-paper-ink">
                Public publication pages, inbox delivery, and a feed built
                around sustained reading instead of interruption.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-meta text-paper-muted tracking-widest">
                IDENTITY
              </p>
              <p className="text-[1.125rem] leading-[1.6] text-paper-ink">
                Start at <span className="font-semibold">@username</span>, then
                graduate to your own custom domain when your writing deserves
                its own front door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-paper-border">
        <div className="mx-auto max-w-[1200px] px-8 py-20 md:px-12 md:py-24 lg:px-16">
          <div className="space-y-16">
            <div className="mx-auto max-w-[800px] space-y-6 text-center">
              <p className="text-meta text-paper-muted tracking-widest">
                HOW KRAKEN WORKS
              </p>
              <h2 className="font-family-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.92] tracking-[-0.035em] text-paper-ink">
                A social product that behaves more like a publication.
              </h2>
              <p className="text-[1.2rem] leading-[1.65] text-paper-muted">
                The point is not constant posting. The point is building a
                durable rhythm of updates that can be read, followed, and
                returned to.
              </p>
            </div>

            <div className="mx-auto max-w-[760px] space-y-12">
              <div className="space-y-4 border-t-2 border-paper-ink pt-8">
                <p className="text-meta text-paper-muted tracking-widest">
                  STEP 01
                </p>
                <h3 className="font-family-display text-[2.2rem] leading-[1.1] tracking-[-0.02em] text-paper-ink">
                  Write like an editor, not a poster.
                </h3>
                <p className="text-[1.1rem] leading-[1.7] text-paper-muted">
                  Draft in editions, refine the title, and publish when the
                  piece is ready to stand on its own. No timeline pressure, just
                  editorial standards.
                </p>
              </div>

              <div className="space-y-4 border-t border-paper-border pt-8">
                <p className="text-meta text-paper-muted tracking-widest">
                  STEP 02
                </p>
                <h3 className="font-family-display text-[2.2rem] leading-[1.1] tracking-[-0.02em] text-paper-ink">
                  Build a readership that wants your updates.
                </h3>
                <p className="text-[1.1rem] leading-[1.7] text-paper-muted">
                  Readers subscribe by username and receive issues in a format
                  made for sustained attention rather than infinite scroll.
                </p>
              </div>

              <div className="space-y-4 border-t border-paper-border pt-8">
                <p className="text-meta text-paper-muted tracking-widest">
                  STEP 03
                </p>
                <h3 className="font-family-display text-[2.2rem] leading-[1.1] tracking-[-0.02em] text-paper-ink">
                  Let your archive become a body of work.
                </h3>
                <p className="text-[1.1rem] leading-[1.7] text-paper-muted">
                  Each edition deepens your publication over time, turning
                  regular updates into something readers can revisit and
                  reference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="border-b border-paper-border">
        <div className="mx-auto max-w-[1200px] px-8 py-20 md:px-12 md:py-24 lg:px-16">
          <div className="mx-auto max-w-[900px] space-y-12">
            <div className="space-y-6">
              <p className="text-meta text-paper-muted tracking-widest">
                WHO IT FITS
              </p>
              <h2 className="font-family-display text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[0.94] tracking-[-0.035em] text-paper-ink">
                Built for people who want a body of work, not a stream of
                fragments.
              </h2>
            </div>

            <div className="space-y-6 pl-8 text-[1.15rem] leading-[1.75] text-paper-ink md:pl-12">
              <p className="relative before:absolute before:-left-8 before:content-['—'] before:text-paper-muted md:before:-left-12">
                People who have more to say than a social post can hold
              </p>
              <p className="relative before:absolute before:-left-8 before:content-['—'] before:text-paper-muted md:before:-left-12">
                Writers who want consistency without pressure to perform daily
              </p>
              <p className="relative before:absolute before:-left-8 before:content-['—'] before:text-paper-muted md:before:-left-12">
                Friend groups, communities, and niche followings that prefer
                substance
              </p>
              <p className="relative before:absolute before:-left-8 before:content-['—'] before:text-paper-muted md:before:-left-12">
                Anyone building a publication identity before they need a full
                newsletter stack
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Block */}
      <section className="border-b-2 border-paper-ink bg-paper-ink">
        <div className="mx-auto max-w-[1200px] px-8 py-20 md:px-12 md:py-24 lg:px-16">
          <div className="mx-auto max-w-[760px] space-y-8">
            <p className="text-meta tracking-widest text-paper-base/60">
              WHY IT LANDS
            </p>
            <h2 className="font-family-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.96] tracking-[-0.03em] text-paper-base">
              A calmer publishing habit creates a stronger public record.
            </h2>
            <p className="text-[1.2rem] leading-[1.7] text-paper-base/85">
              Kraken is for the updates people keep meaning to write: the ones
              that disappear in chat threads but become meaningful when you give
              them a masthead, an archive, and a cadence.
            </p>
            <div className="space-y-3 pt-6 text-[1.05rem] text-paper-base/75">
              <p>→ Readers get a publication, not a pile of fragments.</p>
              <p>→ Writers get identity, rhythm, and a place to return to.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto max-w-[1200px] px-8 py-24 md:px-12 md:py-32 lg:px-16 lg:py-40">
          <div className="mx-auto max-w-[860px] space-y-12 text-center">
            <div className="space-y-6">
              <p className="text-meta text-paper-muted tracking-widest">
                START THE PUBLICATION
              </p>
              <h2 className="font-family-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.04em] text-paper-ink">
                Write something worth sending.
              </h2>
              <p className="mx-auto max-w-[640px] text-[1.25rem] leading-[1.7] text-paper-muted">
                Kraken is for updates with weight: the kind people open, read,
                and remember because they came from someone they care about.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href={isSignedIn ? "/editorial" : "/auth/sign-up"}
                className="inline-flex items-center justify-center bg-paper-ink px-8 py-4 text-meta-small tracking-wider text-paper-base transition-all hover:bg-paper-accent"
              >
                {isSignedIn ? "OPEN EDITORIAL" : "CLAIM YOUR MASTHEAD"}
              </Link>
              <Link
                href={isSignedIn ? publicationHref : "/feed"}
                className="inline-flex items-center justify-center px-8 py-4 text-meta-small tracking-wider text-paper-ink underline decoration-1 underline-offset-4 transition-colors hover:text-paper-accent"
              >
                {isSignedIn ? "SEE YOUR PUBLICATION" : "READ THE PUBLIC FEED"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
