"use client";

import { useState } from "react";
import { createPublication } from "@/app/actions/publication";

interface OnboardingFormProps {
  initialUsername: string;
  userId: string;
}

export default function OnboardingForm({
  initialUsername,
  userId,
}: OnboardingFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await createPublication(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="userId" value={userId} />

      <div>
        <label
          htmlFor="username"
          className="block text-xs font-sans uppercase tracking-widest text-muted-ink mb-1"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          defaultValue={initialUsername}
          required
          className="w-full border border-ink-border p-3 no-round font-sans text-sm focus:outline-none focus:ring-1 focus:ring-ink"
          placeholder="your_slug"
        />
        <p className="mt-1 text-[10px] text-muted-ink">
          This will be your publication URL: kraken.krishg.com/@your_slug
        </p>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-xs font-sans uppercase tracking-widest text-muted-ink mb-1"
        >
          Publication Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full border border-ink-border p-3 no-round font-serif text-lg focus:outline-none focus:ring-1 focus:ring-ink"
          placeholder="The Kraken Weekly"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-xs font-sans uppercase tracking-widest text-muted-ink mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="w-full border border-ink-border p-3 no-round font-serif text-sm h-24 resize-none focus:outline-none focus:ring-1 focus:ring-ink"
          placeholder="What is your publication about?"
        />
      </div>

      {error && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-600 text-xs no-round">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ink text-paper py-3 no-round font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
      >
        {loading ? "Establishing..." : "Establish Publication"}
      </button>
    </form>
  );
}
