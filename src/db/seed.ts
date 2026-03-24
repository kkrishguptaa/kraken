import "dotenv/config";
import { db } from "./index";
import { publications, users } from "./schema";

async function main() {
  console.log("Seeding database...");

  const testUser = await db
    .insert(users)
    .values({
      id: "user_2test_clerk_id",
      username: "testuser",
      email: "test@example.com",
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        username: "testuser",
        email: "test@example.com",
      },
    })
    .returning();

  console.log("Inserted test user:", testUser[0].id);

  const testPub = await db
    .insert(publications)
    .values({
      userId: testUser[0].id,
      name: "The Kraken Weekly",
      description: "A newsletter about all things deep and mysterious.",
      slug: "kraken-weekly",
    })
    .onConflictDoUpdate({
      target: publications.slug,
      set: {
        name: "The Kraken Weekly",
        description: "A newsletter about all things deep and mysterious.",
      },
    })
    .returning();

  console.log("Inserted test publication:", testPub[0].slug);

  console.log("Seeding complete!");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
