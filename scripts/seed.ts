import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { issues, publications, user } from "../src/db/schema";
import { db } from "../src/lib/db";

const mockArticles = [
  {
    publicationName: "KRISH'S KRAKEN",
    editionNumber: 1,
    title: "Mumbai's Bold New Transit Vision",
    content: `The city of Mumbai has approved a sweeping new transit plan that promises to reshape daily commute times for over twelve million residents. Officials say construction begins next quarter, pending final funding approvals from the central government. The plan calls for three new metro lines, a coastal rail corridor, and the first fully automated bus network in South Asia. Urban planners have spent four years modelling the proposal, drawing on data from Tokyo, Singapore, and Bogotá. Critics have raised concerns about displacement of informal settlements along the proposed routes, while supporters argue the scheme will reduce the city's carbon footprint by a third within a decade. The prime minister called the project "the most ambitious infrastructure project in the city's modern history."`,
  },
  {
    publicationName: "THE ORBITAL",
    editionNumber: 2,
    title: "Unknown Radio Signal Detected Beyond the Milky Way",
    content: `Astronomers at the European Space Agency have confirmed detection of a previously unknown radio signal originating from far beyond the Milky Way. The source remains unidentified. Theories range from a distant pulsar to the gravitational effects of a quasar or a black hole merg in a remote galaxy. Teams across three continents are now coordinating urgent follow-up observations using the Square Kilometre Array in South Africa and Western Australia. The signal is detected months but kept confidential while researchers worked to rule out terrestrial interference. What makes it unusual is not merely its distance, but its regularity — it pulses at an interval of exactly 27 seconds, a precision that has no obvious natural explanation. Senior astronomers caution against speculation but privately admit they have never encountered anything quite like this before.`,
  },
  {
    publicationName: "MIDNIGHT TAKE",
    editionNumber: 3,
    title: "Morning Rituals and the Creative Mind",
    content: `A new study from the National Institute links early morning routines to measurable gains in creative output. Researchers interviewed over two hundred artists, writers, and designers, tracking their work habits across six months. Those who maintained consistent wake times and morning rituals — whether journaling, walking, or simply sitting with coffee — reported higher satisfaction with their creative output and fewer periods of stagnation. The study challenges the romantic notion of the tortured, chaotic artist, suggesting instead that structure paradoxically unlocks freedom.`,
  },
  {
    publicationName: "BUILD LOG",
    editionNumber: 4,
    title: "The Open Source Funding Gap",
    content: `Funding shortfalls are putting critical open source projects at risk. Maintainers warn of cascading failures if support doesn't materialise before the end of the financial year. Three widely-used cryptography libraries, two database drivers, and a core networking stack are all operating on volunteer labour alone. The developers behind these projects have appealed publicly for sponsorship, but corporate users remain reluctant to commit. One maintainer described the situation as "absurd" — billions of dollars of commercial software depend on code written by unpaid individuals working nights and weekends.`,
  },
  {
    publicationName: "KRISH'S KRAKEN",
    editionNumber: 5,
    title: "The Quiet Crisis in Urban Green Space",
    content: `Green space per resident has fallen eighteen percent in the last decade across major British cities, according to new research from the National Council for Town Planning. City planners are only beginning to reckon with the long-term public health consequences. Studies consistently link access to parks and urban green areas to lower rates of anxiety, depression, and cardiovascular disease. But as housing demand intensifies and development accelerates, these spaces are disappearing. Activists are calling for protected green corridors and mandatory minimum green space ratios in new developments.`,
  },
  {
    publicationName: "THE SLOW READ",
    editionNumber: 6,
    title: "What Literature Gets Wrong About Memory",
    content: `Memory, as rendered in fiction, is almost always wrong — and that might actually be the point. Where literature of remembrance from Proust to Morrison treats memory as a kind of time travel or emotional archaeology, neuroscience paints a far messier picture. Memories aren't retrieved; they're reconstructed each time we recall them, subtly altered by mood, context, and narrative convenience. Fiction knows this intuitively. The best novels about memory don't pretend to accuracy — they lean into distortion, using it as a formal device to explore identity and loss.`,
  },
  {
    publicationName: "THE ORBITAL",
    editionNumber: 7,
    title: "Mars Sample Return: A Mission in Jeopardy",
    content: `Mars Sample Return faces fresh and possibly fatal budget pressure from the new administration. Three films released this season — one Brazilian, one Korean, one Irish — have each arrived at the same formal refusal: no redemption, no closing of wounds, no collective catharsis. Their characters simply stop, mid-motion, at the point where a conventional narrative would turn toward hope. Critics have been sharply divided.`,
  },
  {
    publicationName: "MIDNIGHT TAKE",
    editionNumber: 8,
    title: "Why New Cinema Refuses Happy Endings",
    content: `What does the new wave of global cinema tell us about collective anxiety? Three films released this season — one Brazilian, one Korean, one Irish — have each arrived at the same formal refusal: no redemption, no closing of wounds, no collective catharsis. Their characters simply stop, mid-motion, at the point where a conventional narrative would turn toward hope. Critics have been sharply divided, with some calling it honest and others dismissing it as nihilistic posturing.`,
  },
];

async function seed() {
  console.log("🌱 Starting seed...");

  try {
    // Check if we already have a test user
    const testUser = await db.select().from(user).limit(1);

    if (testUser.length === 0) {
      console.log(
        "No users found. Please create a user first through the app.",
      );
      return;
    }

    const userId = testUser[0].id;
    const userName = testUser[0].name || "Test User";
    console.log(`✓ Using user: ${userName} (${userId})`);

    // Since there's a unique constraint on userId in publications,
    // let's use/update the existing publication
    const publication = await db
      .select()
      .from(publications)
      .where(eq(publications.userId, userId))
      .limit(1);

    let pubId: string;
    if (publication.length === 0) {
      console.log("📚 Creating publication...");
      const [newPub] = await db
        .insert(publications)
        .values({
          userId,
          name: "KRISH'S KRAKEN",
          description: "Personal updates and insights",
        })
        .returning();
      pubId = newPub.id;
      console.log(`  ✓ Created publication`);
    } else {
      pubId = publication[0].id;
      console.log(`✓ Using existing publication: ${publication[0].name}`);
    }

    // Create mock issues for the single publication but with varied publication names in titles
    console.log("📄 Creating issues...");
    const now = new Date();

    for (let i = 0; i < mockArticles.length; i++) {
      const article = mockArticles[i];

      const publishedAt = new Date(now);
      publishedAt.setDate(now.getDate() - i); // Stagger dates

      const existing = await db
        .select()
        .from(issues)
        .where(
          and(eq(issues.title, article.title), eq(issues.publicationId, pubId)),
        )
        .limit(1);

      if (existing.length > 0) {
        console.log(`  ⤷ ${article.title} already exists`);
      } else {
        await db.insert(issues).values({
          userId,
          publicationId: pubId,
          title: article.title,
          content: article.content,
          editionNumber: article.editionNumber,
          status: "published",
          publishedAt,
        });
        console.log(`  ✓ Created ${article.title}`);
      }
    }

    console.log("✨ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
