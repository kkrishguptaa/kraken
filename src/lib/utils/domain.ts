export function normalizeDomain(raw: string): string {
  const candidate = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "");
  const hostname = candidate.split("/")[0]?.replace(/\.$/, "") ?? "";

  if (
    !hostname ||
    hostname.startsWith(".") ||
    hostname.includes("..") ||
    hostname.includes(":") ||
    !hostname.includes(".") ||
    !/^[a-z0-9.-]+$/.test(hostname)
  ) {
    return "";
  }

  return hostname;
}
