import assert from "node:assert/strict";
import test from "node:test";
import {
  formatEditorialDate,
  parsePublishDateInput,
  toDateOnlyInputValue,
} from "@/lib/utils/publish-date";

test("parsePublishDateInput accepts a valid date-only value", () => {
  const parsed = parsePublishDateInput("2026-03-31");

  assert.equal(parsed.toISOString(), "2026-03-31T00:00:00.000Z");
});

test("parsePublishDateInput rejects malformed values", () => {
  assert.throws(() => parsePublishDateInput("2026-03-31T10:30"), {
    message: "Publish date is invalid.",
  });
  assert.throws(() => parsePublishDateInput("2026-02-31"), {
    message: "Publish date is invalid.",
  });
});

test("toDateOnlyInputValue and formatEditorialDate use UTC calendar dates", () => {
  const value = new Date("2026-03-31T23:15:00.000Z");

  assert.equal(toDateOnlyInputValue(value), "2026-03-31");
  assert.equal(formatEditorialDate(value), "Mar 31, 2026");
});
