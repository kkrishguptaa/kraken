import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import DashboardPage from "@/components/DashboardPage";
import MarketingPage from "@/components/MarketingPage";
import { db } from "@/db";
import { issues, publications } from "@/db/schema";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return <MarketingPage />;
  }

  // Check if user has a publication
  const publication = await db.query.publications.findFirst({
    where: eq(publications.userId, userId),
  });

  if (!publication) {
    redirect("/onboarding");
  }

  // Get issues for dashboard
  const userIssues = await db.query.issues.findMany({
    where: eq(issues.publicationId, publication.id),
    orderBy: [desc(issues.createdAt)],
  });

  return (
    <DashboardPage
      publication={{
        id: publication.id,
        name: publication.name,
        slug: publication.slug,
      }}
      issues={userIssues}
    />
  );
}
