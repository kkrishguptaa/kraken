const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function formatUtcDatePart(value: number): string {
  return String(value).padStart(2, "0");
}

export function todayDateOnlyString(now = new Date()): string {
  return [
    now.getUTCFullYear(),
    formatUtcDatePart(now.getUTCMonth() + 1),
    formatUtcDatePart(now.getUTCDate()),
  ].join("-");
}

export function toDateOnlyInputValue(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return [
    date.getUTCFullYear(),
    formatUtcDatePart(date.getUTCMonth() + 1),
    formatUtcDatePart(date.getUTCDate()),
  ].join("-");
}

export function parsePublishDateInput(value?: string): Date {
  const normalized = value?.trim() || todayDateOnlyString();

  if (!DATE_ONLY_PATTERN.test(normalized)) {
    throw new Error("Publish date is invalid.");
  }

  const parsed = new Date(`${normalized}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Publish date is invalid.");
  }

  if (toDateOnlyInputValue(parsed) !== normalized) {
    throw new Error("Publish date is invalid.");
  }

  if (normalized > todayDateOnlyString()) {
    throw new Error("Publish date cannot be in the future.");
  }

  return parsed;
}

export function formatEditorialDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}
