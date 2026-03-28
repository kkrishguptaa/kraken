"use client";

import Link from "next/link";
import { authSurfaceButtonClassName } from "@/components/auth/auth-styles";
import { GoogleButton } from "@/components/auth/google-button";

type AuthEntryOptionsProps = {
  separatorLabel: string;
};

export function AuthEntryOptions({ separatorLabel }: AuthEntryOptionsProps) {
  return (
    <>
      <GoogleButton
        label="Continue with Google"
        className={authSurfaceButtonClassName}
      />

      <div className="grid grid-cols-2 gap-3">
        <Link href="/auth/email" className={authSurfaceButtonClassName}>
          Email OTP
        </Link>
        <Link href="/auth/email" className={authSurfaceButtonClassName}>
          Magic Link
        </Link>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-paper-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-paper-base px-2 text-paper-muted">
            {separatorLabel}
          </span>
        </div>
      </div>
    </>
  );
}
