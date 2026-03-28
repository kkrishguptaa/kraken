import Link from "next/link";

const distributionModes = [
  {
    eyebrow: "Publish on your rhythm",
    title: "Daily dispatches, weekly letters, monthly essays.",
    body: "Kraken is built for recurring writing. Keep a consistent pulse without turning your life into content sludge.",
  },
  {
    eyebrow: "Reach the right people",
    title: "Email, public pages, and a social feed that feels editorial.",
    body: "Every edition can live on your publication, land in subscribers' inboxes, and circulate through a calmer feed.",
  },
  {
    eyebrow: "Own the presentation",
    title: "A paper-like masthead with room to grow into your own publication.",
    body: "Start with an @username publication, then move onto a custom domain when your writing deserves its own front door.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Write like an editor, not a poster.",
    body: "Draft in editions, refine the title, and publish when the piece is ready to stand on its own.",
  },
  {
    step: "02",
    title: "Build a readership that wants your updates.",
    body: "Readers subscribe by username and receive issues in a format made for sustained reading instead of interruption.",
  },
  {
    step: "03",
    title: "Let your archive become a body of work.",
    body: "Each edition deepens your publication over time, turning regular updates into something readers can revisit.",
  },
];

const audienceSignals = [
  "People who have more to say than a social post can hold",
  "Writers who want consistency without pressure to perform daily",
  "Friend groups, communities, and niche followings that prefer substance",
  "Anyone building a publication identity before they need a full newsletter stack",
];

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
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-6 pb-16 pt-6 md:px-12 md:pb-20 md:pt-8">
        <section className="border border-paper-border bg-white/70 auth-paper-grain">
          <div className="border-b border-paper-border px-5 py-3 md:px-8">
            <div className="flex flex-col gap-3 text-meta-small text-paper-muted sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span>Kraken</span>
                <span className="hidden text-paper-border sm:inline">/</span>
                <span>Personal publishing for recurring updates</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-paper-ink">
                <Link
                  className="underline-offset-4 hover:underline"
                  href="/feed"
                >
                  Read the feed
                </Link>
                <Link
                  className="underline-offset-4 hover:underline"
                  href="/subscriptions"
                >
                  Reader desk
                </Link>
                <Link
                  className="underline-offset-4 hover:underline"
                  href={isSignedIn ? "/editorial" : "/auth/sign-in"}
                >
                  {isSignedIn ? "Editorial" : "Sign in"}
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-10 px-5 py-8 md:px-8 md:py-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)] lg:gap-12">
            <div className="animate-stagger space-y-8">
              <div className="space-y-4">
                <p className="text-meta text-paper-muted">
                  Abyssal Press Edition No. 001
                </p>
                <h1 className="font-family-display text-[clamp(3.4rem,9vw,7rem)] leading-[0.9] tracking-[-0.04em] text-paper-ink">
                  Your personal paper, published on your own cadence.
                </h1>
                <p className="max-w-3xl text-[clamp(1.05rem,1.6vw,1.35rem)] leading-8 text-paper-muted">
                  Kraken turns daily notes, weekly letters, and monthly essays
                  into an editorial publication people can follow in the feed,
                  read on the web, and receive by email.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={isSignedIn ? "/editorial" : "/auth/sign-up"}
                  className="border border-paper-ink bg-paper-ink px-5 py-3 text-meta-small text-paper-base transition hover:bg-paper-accent hover:border-paper-accent"
                >
                  {isSignedIn
                    ? "Write your next edition"
                    : "Start your publication"}
                </Link>
                <Link
                  href={isSignedIn ? publicationHref : "/feed"}
                  className="border border-paper-border px-5 py-3 text-meta-small text-paper-ink transition hover:bg-paper-border/50"
                >
                  {isSignedIn
                    ? "Visit your publication"
                    : "Browse public editions"}
                </Link>
                <Link
                  href={isSignedIn ? "/home" : "/auth/sign-in"}
                  className="text-meta-small text-paper-ink underline underline-offset-4"
                >
                  {isSignedIn
                    ? "Keep this page nearby at /home"
                    : "Already writing on Kraken?"}
                </Link>
              </div>

              <div className="grid gap-4 border-y border-paper-border py-5 md:grid-cols-3">
                <div>
                  <p className="text-meta-small text-paper-muted">Cadence</p>
                  <p className="mt-2 text-body-editorial text-paper-ink">
                    Daily, weekly, monthly, or whenever a real update is ready.
                  </p>
                </div>
                <div>
                  <p className="text-meta-small text-paper-muted">
                    Distribution
                  </p>
                  <p className="mt-2 text-body-editorial text-paper-ink">
                    Public publication pages, inbox delivery, and a feed built
                    around reading.
                  </p>
                </div>
                <div>
                  <p className="text-meta-small text-paper-muted">Identity</p>
                  <p className="mt-2 text-body-editorial text-paper-ink">
                    Start at{" "}
                    <span className="font-semibold text-paper-ink">
                      @username
                    </span>
                    , then graduate to your own domain.
                  </p>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="border border-paper-ink bg-paper-base p-5 shadow-[8px_8px_0_0_rgba(22,18,15,0.08)]">
                <div className="flex items-center justify-between border-b border-paper-border pb-3">
                  <p className="text-meta-small text-paper-muted">
                    Front page proof
                  </p>
                  <p className="text-meta-small text-paper-ink">Issue 014</p>
                </div>
                <div className="space-y-4 py-5">
                  <p className="text-meta text-paper-muted">
                    From the publication desk
                  </p>
                  <h2 className="font-family-display text-[2.25rem] leading-[0.95] tracking-[-0.03em] text-paper-ink">
                    Small things worth sending to people you actually care
                    about.
                  </h2>
                  <p className="text-body-editorial text-paper-muted">
                    A quiet publishing stack for life updates, essays,
                    dispatches, and community notes that deserve more permanence
                    than a timeline.
                  </p>
                </div>
                <div className="grid gap-3 border-t border-paper-border pt-4 text-meta-small text-paper-ink">
                  <div className="flex items-center justify-between">
                    <span>Route</span>
                    <span>/@username</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email</span>
                    <span>Subscribers receive new editions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Upgrade</span>
                    <span>Bring your own domain</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                <div className="border border-paper-border bg-white/70 p-4">
                  <p className="text-meta-small text-paper-muted">
                    In the inbox
                  </p>
                  <p className="mt-3 font-family-display text-2xl leading-tight text-paper-ink">
                    Confirm subscription
                  </p>
                  <p className="mt-2 text-body-editorial text-paper-muted">
                    Readers can opt in and follow your publication without
                    needing to hover over every post.
                  </p>
                </div>
                <div className="border border-paper-border bg-white/70 p-4">
                  <p className="text-meta-small text-paper-muted">
                    On your own domain
                  </p>
                  <p className="mt-3 font-family-display text-2xl leading-tight text-paper-ink">
                    news.example.com
                  </p>
                  <p className="mt-2 text-body-editorial text-paper-muted">
                    Start simple, then give the publication its own masthead and
                    front door when it matters.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-6 border-b border-paper-border py-12 md:py-14 lg:grid-cols-3">
          {distributionModes.map((mode) => (
            <article
              key={mode.title}
              className="border border-paper-border bg-white/55 p-6"
            >
              <p className="text-meta-small text-paper-muted">{mode.eyebrow}</p>
              <h2 className="mt-4 font-family-display text-[2rem] leading-[1] tracking-[-0.025em] text-paper-ink">
                {mode.title}
              </h2>
              <p className="mt-4 text-body-editorial text-paper-muted">
                {mode.body}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 py-12 md:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-4">
            <p className="text-meta text-paper-muted">How Kraken Works</p>
            <h2 className="font-family-display text-[clamp(2.6rem,5vw,4.3rem)] leading-[0.94] tracking-[-0.03em] text-paper-ink">
              A social product that behaves more like a publication.
            </h2>
            <p className="max-w-xl text-body-editorial text-paper-muted">
              The point is not constant posting. The point is building a durable
              rhythm of updates that can be read, followed, and returned to.
            </p>
          </div>

          <div className="space-y-5">
            {processSteps.map((item) => (
              <article
                key={item.step}
                className="grid gap-4 border-t border-paper-border pt-5 md:grid-cols-[72px_minmax(0,1fr)]"
              >
                <p className="text-meta text-paper-muted">{item.step}</p>
                <div>
                  <h3 className="font-family-display text-[1.9rem] leading-tight text-paper-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-body-editorial text-paper-muted">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-y border-paper-border py-12 md:py-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div>
            <p className="text-meta text-paper-muted">Who It Fits</p>
            <h2 className="mt-3 font-family-display text-[clamp(2.4rem,4.8vw,3.8rem)] leading-[0.96] tracking-[-0.03em] text-paper-ink">
              Built for people who want a body of work, not a stream of
              fragments.
            </h2>
            <div className="mt-6 grid gap-3">
              {audienceSignals.map((signal) => (
                <div
                  key={signal}
                  className="flex items-start gap-3 border border-paper-border bg-white/60 px-4 py-3"
                >
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-paper-ink" />
                  <p className="text-body-editorial text-paper-ink">{signal}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-paper-ink bg-paper-ink p-6 text-paper-base">
            <p className="text-meta-small text-paper-border">Why it lands</p>
            <p className="mt-4 font-family-display text-[2rem] leading-tight">
              A calmer publishing habit creates a stronger public record.
            </p>
            <p className="mt-4 text-body-editorial text-paper-base/80">
              Kraken is for the updates people keep meaning to write: the ones
              that disappear in chat threads but become meaningful when you give
              them a masthead, an archive, and a cadence.
            </p>
            <div className="mt-6 space-y-2 text-meta-small text-paper-border">
              <p>Readers get a publication, not a pile of fragments.</p>
              <p>Writers get identity, rhythm, and a place to return to.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-4">
            <p className="text-meta text-paper-muted">Start The Publication</p>
            <h2 className="font-family-display text-[clamp(2.8rem,5.2vw,4.8rem)] leading-[0.92] tracking-[-0.035em] text-paper-ink">
              Write something worth sending.
            </h2>
            <p className="max-w-2xl text-body-editorial text-paper-muted">
              Kraken is for updates with weight: the kind people open, read, and
              remember because they came from someone they care about.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href={isSignedIn ? "/editorial" : "/auth/sign-up"}
              className="border border-paper-ink bg-paper-ink px-5 py-3 text-meta-small text-paper-base transition hover:bg-paper-accent hover:border-paper-accent"
            >
              {isSignedIn ? "Open editorial" : "Claim your masthead"}
            </Link>
            <Link
              href={isSignedIn ? publicationHref : "/feed"}
              className="border border-paper-border px-5 py-3 text-meta-small text-paper-ink transition hover:bg-paper-border/50"
            >
              {isSignedIn ? "See your publication" : "Read the public feed"}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
