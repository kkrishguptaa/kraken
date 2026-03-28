import { KrakenLandingPage } from "@/components/landing/KrakenLandingPage";
import { getSession } from "@/hooks/session";

export const dynamic = "force-dynamic";

export default async function MarketingHomePage() {
  let session = null;

  try {
    session = await getSession();
  } catch (error) {
    console.error("Failed to get session on /home:", error);
  }

  return <KrakenLandingPage session={session} />;
}
