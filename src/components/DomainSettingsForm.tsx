"use client";

import { AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { addCustomDomain, verifyCustomDomain } from "@/app/actions/domains";

interface DomainSettingsFormProps {
  publicationId: string;
  initialDomain: string;
  isVerified: boolean;
}

export default function DomainSettingsForm({
  publicationId,
  initialDomain,
  isVerified,
}: DomainSettingsFormProps) {
  const [domain, setDomain] = useState(initialDomain);
  const [verified, setVerified] = useState(isVerified);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await addCustomDomain(publicationId, domain);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({
        type: "success",
        text: "Domain added. Please set up DNS records.",
      });
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    setMessage(null);

    const result = await verifyCustomDomain(publicationId);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setVerified(true);
      setMessage({ type: "success", text: "Domain verified successfully!" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="flex gap-4">
        <div className="flex-1">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="news.yourdomain.com"
            disabled={verified}
            className="w-full border border-ink-border p-3 no-round font-sans text-sm focus:outline-none focus:ring-1 focus:ring-ink disabled:bg-zinc-50 disabled:text-muted-ink"
          />
        </div>
        {!verified && (
          <button
            type="submit"
            disabled={loading || !domain || domain === initialDomain}
            className="bg-ink text-paper px-8 py-3 no-round font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            Add
          </button>
        )}
      </form>

      {domain && !verified && (
        <div className="p-6 border border-ink-border bg-white space-y-4">
          <h3 className="text-sm font-sans font-bold uppercase tracking-wider flex items-center gap-2">
            <AlertCircle size={16} className="text-muted-ink" />
            DNS Configuration Required
          </h3>
          <p className="text-xs text-muted-ink font-sans leading-relaxed">
            Please add the following CNAME record to your DNS provider:
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-zinc-50 p-4 border border-ink-border">
            <div>
              <span className="block text-muted-ink mb-1">Type</span>
              <span>CNAME</span>
            </div>
            <div>
              <span className="block text-muted-ink mb-1">Name</span>
              <span>{domain.split(".")[0]}</span>
            </div>
            <div className="col-span-2">
              <span className="block text-muted-ink mb-1">Value</span>
              <span>cname.vercel-dns.com</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
            className="w-full border border-ink text-ink py-3 no-round font-medium hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify DNS Configuration"}
          </button>
        </div>
      )}

      {verified && (
        <div className="flex items-center gap-2 text-green-600 font-sans text-sm">
          <CheckCircle size={18} />
          <span>Your custom domain is verified and active.</span>
          <a
            href={`https://${domain}`}
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-ink flex items-center gap-1 hover:underline"
          >
            Visit Site <ExternalLink size={14} />
          </a>
        </div>
      )}

      {message && (
        <div
          className={`p-4 no-round text-xs font-sans ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
