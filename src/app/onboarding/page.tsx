import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import OnboardingForm from "@/components/OnboardingForm";
import PageWrapper from "@/components/PageWrapper";
import { db } from "@/db";
import { publications } from "@/db/schema";

export default async function OnboardingPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Check if publication already exists
  const existingPub = await db.query.publications.findFirst({
    where: eq(publications.userId, userId),
  });

  if (existingPub) {
    redirect("/");
  }

  return (
    <PageWrapper className="max-w-2xl py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl italic mb-4 font-serif">
          Setup Your Publication
        </h1>
        <p className="text-muted-ink">
          Welcome to the Kraken News Network. Let's establish your broadsheet.
        </p>
      </div>

      <div className="border border-ink-border p-8 no-round bg-white">
        <OnboardingForm initialUsername={user.username || ""} userId={userId} />
      </div>
    </PageWrapper>
  );
}
