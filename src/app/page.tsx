import { getSession } from "@/hooks/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-paper-base">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 py-16 md:px-12">
        <div className="space-y-8 border border-paper-border bg-white/70 p-8 md:p-12">
          <p className="text-meta text-paper-muted">KRAKEN</p>
          <h1 className="font-family-display text-[clamp(2.2rem,7vw,5rem)] leading-[0.95] text-paper-ink">
            Write your life in editions for people who matter.
          </h1>
          <p className="max-w-3xl text-body-editorial text-paper-muted">
            Kraken is an editorial social platform where updates are deliberate,
            personal, and human. Publish daily notes, weekly letters, or monthly
            essays to your publication and let people subscribe by email.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={session ? "/feed" : "/auth/sign-up"}
              className="border border-paper-ink px-5 py-2 text-meta-small text-paper-ink transition hover:bg-paper-ink hover:text-paper-base"
            >
              {session ? "Open feed" : "Start writing"}
            </a>
            <a
              href={session ? "/editorial" : "/auth/sign-in"}
              className="border border-paper-border px-5 py-2 text-meta-small text-paper-ink transition hover:bg-paper-border"
            >
              {session ? "Go to editorial" : "Sign in"}
            </a>
            {session?.user?.username ? (
              <a
                href={`/@${session.user.username}`}
                className="text-meta-small underline underline-offset-2 text-paper-ink"
              >
                Visit your publication
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
