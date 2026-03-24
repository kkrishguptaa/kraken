import Link from "next/link";
import HorizontalRule from "./HorizontalRule";
import IssueCard from "./IssueCard";
import Masthead from "./Masthead";
import PageWrapper from "./PageWrapper";

export default function MarketingPage() {
  return (
    <PageWrapper className="pt-0">
      <div className="flex justify-between items-center py-4 border-b border-ink-border mb-8 text-xs font-sans uppercase tracking-[0.2em] text-muted-ink">
        <span>EST. 2026</span>
        <span>KRAKEN NEWS NETWORK</span>
        <span>VOLUME I</span>
      </div>

      <Masthead
        publicationName="Kraken News"
        date="Wednesday, March 24, 2026"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
        {/* Main Column */}
        <div className="md:col-span-8 flex flex-col gap-8">
          <div className="border border-ink-border p-8 no-round bg-[#FDFCFB]">
            <h2 className="text-5xl font-serif mb-6 leading-tight">
              The Digital Broadsheet Era Has Arrived.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="text-lg leading-relaxed font-serif text-ink space-y-4">
                <p>
                  Kraken News is a sanctuary for long-form writing and editorial
                  precision. We've stripped away the noise of modern newsletters
                  to bring back the tactile clarity of the morning paper.
                </p>
                <p>
                  Self-host your publication on your own domain, write with a
                  rich markdown editor, and distribute your ideas via web and
                  email with uncompromising style.
                </p>
                <div className="pt-4">
                  <Link
                    href="/sign-up"
                    className="inline-block bg-ink text-paper px-8 py-3 no-round font-medium hover:bg-[#333] transition-colors"
                  >
                    Start Your Publication
                  </Link>
                </div>
              </div>
              <div className="bg-ink-border h-full aspect-[3/4] no-round flex items-center justify-center p-8 text-center border border-ink-border">
                <p className="font-serif italic text-muted-ink">
                  "The most beautiful way to read on the web."
                </p>
              </div>
            </div>
          </div>

          <HorizontalRule />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <IssueCard
              slug="example"
              editionNumber={12}
              title="The Architecture of Digital Solitude"
              date="March 20, 2026"
              excerpt="Exploring how we build spaces for thinking in an age of constant connectivity. A deep dive into the philosophy of quiet design."
            />
            <IssueCard
              slug="example"
              editionNumber={11}
              title="Why Typography Matters More Than Ever"
              date="March 15, 2026"
              excerpt="The history and future of serif typefaces on screens. How ink-inspired fonts are reclaiming their throne in digital media."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-4 border-l border-ink-border pl-8 space-y-8">
          <div>
            <h3 className="text-xs font-sans uppercase tracking-[0.2em] font-bold border-b border-ink-border pb-2 mb-4">
              Trending Editions
            </h3>
            <ul className="space-y-6">
              {[
                "The Return of the Long-Form Essay",
                "Building on Your Own Terms",
                "Editorial Design in 2026",
                "The Newsletter Renaissance",
              ].map((title, i) => (
                <li key={title} className="group cursor-pointer">
                  <span className="text-xs font-sans text-muted-ink mb-1 block">
                    #{i + 1}
                  </span>
                  <p className="font-serif text-lg group-hover:underline leading-tight">
                    {title}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-ink-border p-6 no-round bg-[#FDFCFB] border border-ink-border">
            <h3 className="text-lg font-serif mb-4 italic">Join the Network</h3>
            <p className="text-sm font-sans text-muted-ink mb-4 leading-relaxed">
              Subscribe to the Kraken Weekly for the best independent journalism
              from across the network.
            </p>
            <input
              type="email"
              placeholder="Email address"
              className="w-full border border-ink-border p-2 no-round mb-2 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-ink"
            />
            <button
              type="button"
              className="w-full bg-ink text-paper py-2 no-round font-medium text-sm"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
