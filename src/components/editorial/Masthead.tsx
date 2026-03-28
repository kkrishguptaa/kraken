import Link from "next/link";
import { AvatarMenu } from "./AvatarMenu";
import { DateDisplay } from "./DateDisplay";

interface MastheadProps {
  userName?: string | null;
  userImage?: string | null;
  userUsername?: string | null;
  showAvatar?: boolean;
  className?: string;
  title?: string;
  linkTo?: string | null;
  date?: Date;
}

export function Masthead({
  userName,
  userImage,
  userUsername,
  showAvatar = false,
  className = "",
  title,
  linkTo,
  date = new Date(),
}: MastheadProps) {
  const mastheadTitle = title?.trim() || "KRAKEN";
  const resolvedLinkTo = linkTo === undefined ? "/" : linkTo;

  const titleSizeClass = (() => {
    if (mastheadTitle === "KRAKEN") {
      return "text-masthead";
    }

    if (mastheadTitle.length > 28) {
      return "font-family-display text-[clamp(1.25rem,2.8vw,1.9rem)] leading-[0.95] tracking-[-0.01em]";
    }

    if (mastheadTitle.length > 20) {
      return "font-family-display text-[clamp(1.45rem,3.2vw,2.35rem)] leading-[0.95] tracking-[-0.015em]";
    }

    return "font-family-display text-[clamp(1.7rem,3.8vw,2.8rem)] leading-[0.95] tracking-[-0.02em]";
  })();

  return (
    <header className={`w-full ${className}`}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-8 mb-6">
        <div className="flex justify-start">
          <DateDisplay
            date={date}
            className="text-lg font-family-body leading-tight"
          />
        </div>

        <div className="flex justify-center">
          {resolvedLinkTo ? (
            <Link
              href={resolvedLinkTo}
              className="block max-w-[min(70vw,38rem)]"
              aria-label="Go to home"
            >
              <h1
                className={`uppercase ${titleSizeClass} truncate text-center text-paper-ink transition-opacity hover:opacity-80`}
                title={mastheadTitle}
              >
                {mastheadTitle}
              </h1>
            </Link>
          ) : (
            <h1
              className={`uppercase ${titleSizeClass} max-w-[min(70vw,38rem)] truncate text-center text-paper-ink`}
              title={mastheadTitle}
            >
              {mastheadTitle}
            </h1>
          )}
        </div>

        <div className="flex justify-end">
          {showAvatar && userName ? (
            <AvatarMenu
              size="small"
              userName={userName}
              userImage={userImage}
              userUsername={userUsername}
            />
          ) : (
            <Link
              href="/auth/sign-in"
              className="text-lg font-family-body text-paper-ink hover:underline transition-all leading-tight"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      <div className="w-full rule-thick" />
    </header>
  );
}
