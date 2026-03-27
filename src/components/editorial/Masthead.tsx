import Link from "next/link";
import { AvatarMenu } from "./AvatarMenu";
import { DateDisplay } from "./DateDisplay";

interface MastheadProps {
  userName?: string | null;
  userImage?: string | null;
  userUsername?: string | null;
  showAvatar?: boolean;
  className?: string;
}

/**
 * Editorial masthead with centered KRAKEN wordmark
 * 3-column grid ensures KRAKEN stays centered regardless of date/avatar width
 * Date and avatar aligned to baseline for visual balance
 */
export function Masthead({
  userName,
  userImage,
  userUsername,
  showAvatar = false,
  className = "",
}: MastheadProps) {
  const today = new Date();

  return (
    <header className={`w-full ${className}`}>
      {/* 3-column grid: equal side columns keep center perfectly balanced */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-8 mb-6">
        {/* Left column: Date - right-aligned, bigger, baseline-aligned */}
        <div className="flex justify-start">
          <DateDisplay
            date={today}
            className="text-lg font-family-body leading-tight"
          />
        </div>

        {/* Center column: KRAKEN wordmark - perfectly centered */}
        <div className="flex justify-center">
          <h1 className="text-masthead text-center text-[var(--color-paper-ink)]">
            KRAKEN
          </h1>
        </div>

        {/* Right column: Avatar with menu or Login button - baseline-aligned */}
        <div className="flex justify-end">
          {showAvatar && userName ? (
            <AvatarMenu size="small" userName={userName} userImage={userImage} userUsername={userUsername} />
          ) : (
            <Link
              href="/auth/sign-in"
              className="text-lg font-family-body text-[var(--color-paper-ink)] hover:underline transition-all leading-tight"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Full-width horizontal rule */}
      <div className="w-full rule-thick" />
    </header>
  );
}
