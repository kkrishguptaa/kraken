"use client";

import { useState, useTransition } from "react";
import { subscribe } from "@/app/actions/social";

interface SubscribeFormProps {
  publicationId: string;
}

export default function SubscribeForm({ publicationId }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    startTransition(async () => {
      await subscribe(publicationId, email);
      setEmail("");
      setMessage("Subscription confirmed. Welcome to the network.");
    });
  };

  return (
    <div className="bg-ink-border p-8 no-round bg-[#FDFCFB] border border-ink-border text-center">
      <h3 className="text-2xl font-serif mb-4 italic">Join the Network</h3>
      <p className="text-sm font-sans text-muted-ink mb-6 leading-relaxed max-w-sm mx-auto">
        Subscribe to receive the latest editions directly in your inkwell.
      </p>

      {message ? (
        <div className="p-4 border border-ink-border no-round text-sm font-serif italic text-ink">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full border border-ink-border p-3 no-round font-sans text-sm focus:outline-none focus:ring-1 focus:ring-ink"
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-ink text-paper py-3 no-round font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {isPending ? "Confirming..." : "Subscribe Now"}
          </button>
        </form>
      )}
    </div>
  );
}
