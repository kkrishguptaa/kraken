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
                Personal Publishing
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
                {isSignedIn ? "WRITE" : "SIGN IN"}
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
                LIFE UPDATES — MARCH 2026
              </p>

              <h2 className="font-family-display text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.88] tracking-[-0.045em] text-paper-ink">
                Stay caught up with your friends' lives without the social media
                chaos.
              </h2>

              <p className="max-w-[680px] text-[1.35rem] leading-[1.65] text-paper-muted md:text-[1.5rem] md:leading-[1.7]">
                Kraken is where your friends share what's really happening in
                their lives—weekly letters, monthly check-ins, or whenever
                something worth sharing comes up. No endless scroll, no
                algorithm deciding who you see, just the people you choose to
                follow.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href={isSignedIn ? "/editorial" : "/auth/sign-up"}
                className="inline-flex items-center justify-center bg-paper-ink px-8 py-4 text-meta-small tracking-wider text-paper-base transition-all hover:bg-paper-accent"
              >
                {isSignedIn
                  ? "WRITE YOUR NEXT UPDATE"
                  : "START SHARING WITH FRIENDS"}
              </Link>
              <Link
                href={isSignedIn ? publicationHref : "/feed"}
                className="inline-flex items-center justify-center px-8 py-4 text-meta-small tracking-wider text-paper-ink underline decoration-1 underline-offset-4 transition-colors hover:text-paper-accent"
              >
                {isSignedIn ? "YOUR PUBLICATION" : "SEE HOW IT WORKS"}
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
              <h3 className="font-family-display text-[1.5rem] leading-tight tracking-[-0.01em] text-paper-ink">
                Your rhythm, not theirs.
              </h3>
              <p className="text-[1.125rem] leading-[1.6] text-paper-ink">
                Share daily notes, weekly letters, or monthly updates. There's
                no algorithm pushing you to post constantly—just write when you
                have something worth sharing.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-meta text-paper-muted tracking-widest">
                DELIVERY
              </p>
              <h3 className="font-family-display text-[1.5rem] leading-tight tracking-[-0.01em] text-paper-ink">
                Inbox, feed, or publication page.
              </h3>
              <p className="text-[1.125rem] leading-[1.6] text-paper-ink">
                Your updates reach friends through email, show up in their feed,
                and live on your personal publication page. They choose how they
                want to stay connected.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-meta text-paper-muted tracking-widest">
                IDENTITY
              </p>
              <h3 className="font-family-display text-[1.5rem] leading-tight tracking-[-0.01em] text-paper-ink">
                Start with @username, grow into your own space.
              </h3>
              <p className="text-[1.125rem] leading-[1.6] text-paper-ink">
                Begin with a simple profile, then add a custom domain if your
                updates turn into something bigger. Your publication grows with
                you.
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
                HOW IT WORKS
              </p>
              <h2 className="font-family-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.92] tracking-[-0.035em] text-paper-ink">
                How staying connected actually works on Kraken.
              </h2>
              <p className="text-[1.2rem] leading-[1.65] text-paper-muted">
                No ads, no algorithm, no endless scroll. Just a calmer way to
                share life updates with people who want to hear from you.
              </p>
            </div>

            <div className="mx-auto max-w-[760px] space-y-12">
              <div className="space-y-4 border-t-2 border-paper-ink pt-8">
                <p className="text-meta text-paper-muted tracking-widest">
                  STEP 01
                </p>
                <h3 className="font-family-display text-[2.2rem] leading-[1.1] tracking-[-0.02em] text-paper-ink">
                  Write updates when they matter.
                </h3>
                <p className="text-[1.1rem] leading-[1.7] text-paper-muted">
                  Draft your update, add a title, publish when it's ready. Could
                  be a quick life check-in or a longer story about what you've
                  been up to—whatever feels right.
                </p>
              </div>

              <div className="space-y-4 border-t border-paper-border pt-8">
                <p className="text-meta text-paper-muted tracking-widest">
                  STEP 02
                </p>
                <h3 className="font-family-display text-[2.2rem] leading-[1.1] tracking-[-0.02em] text-paper-ink">
                  Your friends get them predictably.
                </h3>
                <p className="text-[1.1rem] leading-[1.7] text-paper-muted">
                  People subscribe to your updates by username. They know when
                  to expect your check-ins, and they receive them in their inbox
                  or feed—no algorithm hiding what you share.
                </p>
              </div>

              <div className="space-y-4 border-t border-paper-border pt-8">
                <p className="text-meta text-paper-muted tracking-widest">
                  STEP 03
                </p>
                <h3 className="font-family-display text-[2.2rem] leading-[1.1] tracking-[-0.02em] text-paper-ink">
                  Build a record of your life over time.
                </h3>
                <p className="text-[1.1rem] leading-[1.7] text-paper-muted">
                  Each update adds to your archive. Over time, it becomes a
                  chronological record of what you've been up to—something you
                  and your friends can look back on.
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
                WHO IT'S FOR
              </p>
              <h2 className="font-family-display text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[0.94] tracking-[-0.035em] text-paper-ink">
                Built for people who want to stay close without staying glued to
                their phones.
              </h2>
            </div>

            <div className="space-y-6 pl-8 text-[1.15rem] leading-[1.75] text-paper-ink md:pl-12">
              <p className="relative before:absolute before:-left-8 before:content-['—'] before:text-paper-muted md:before:-left-12">
                You have more to share than a social post can hold, but you're
                not trying to be a professional writer
              </p>
              <p className="relative before:absolute before:-left-8 before:content-['—'] before:text-paper-muted md:before:-left-12">
                You want to keep friends updated without posting every single
                day
              </p>
              <p className="relative before:absolute before:-left-8 before:content-['—'] before:text-paper-muted md:before:-left-12">
                You miss hearing real updates from friends instead of seeing
                what an algorithm thinks you'll engage with
              </p>
              <p className="relative before:absolute before:-left-8 before:content-['—'] before:text-paper-muted md:before:-left-12">
                You'd rather write occasional check-ins than compete for
                attention in someone's crowded feed
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
              Staying connected shouldn't mean drowning in noise.
            </h2>
            <p className="text-[1.2rem] leading-[1.7] text-paper-base/85">
              Kraken exists for the updates your friends keep meaning to send:
              the life changes, the small victories, the things worth sharing
              but too substantial for a status update. Give them a place that
              feels more like writing letters than performing for an audience.
            </p>
            <div className="space-y-3 pt-6 text-[1.05rem] text-paper-base/75">
              <p>→ Your friends get updates, not content.</p>
              <p>→ You get to share life, not curate a persona.</p>
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
                START SHARING
              </p>
              <h2 className="font-family-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.04em] text-paper-ink">
                Share what's actually happening in your life.
              </h2>
              <p className="mx-auto max-w-[640px] text-[1.25rem] leading-[1.7] text-paper-muted">
                Kraken is for the kind of updates your friends actually want to
                read—the ones they'd ask about if you were catching up over
                coffee. Write when you have something to say, and let the people
                who care about you stay caught up.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href={isSignedIn ? "/editorial" : "/auth/sign-up"}
                className="inline-flex items-center justify-center bg-paper-ink px-8 py-4 text-meta-small tracking-wider text-paper-base transition-all hover:bg-paper-accent"
              >
                {isSignedIn ? "WRITE YOUR UPDATE" : "START YOUR PUBLICATION"}
              </Link>
              <Link
                href={isSignedIn ? publicationHref : "/feed"}
                className="inline-flex items-center justify-center px-8 py-4 text-meta-small tracking-wider text-paper-ink underline decoration-1 underline-offset-4 transition-colors hover:text-paper-accent"
              >
                {isSignedIn ? "YOUR PUBLICATION" : "BROWSE FRIEND UPDATES"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
