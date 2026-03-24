import { GoogleButton } from "@/components/google-button";
import { auth } from "../../auth";
import { useSession } from "./hooks/session";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await useSession();

  return (
    <div>
      hi {session.user.name}!

      <h1>Welcome to Kraken Newsletter!</h1>

      <GoogleButton />

    </div>
  );
}
