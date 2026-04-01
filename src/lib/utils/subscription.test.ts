import assert from "node:assert/strict";
import test from "node:test";
import {
  doesSessionOwnSubscriber,
  isValidEmail,
  normalizeReturnTo,
  resolveVerifiedSubscriptionUserId,
} from "@/lib/utils/subscription";

test("normalizeReturnTo keeps safe internal paths", () => {
  assert.equal(normalizeReturnTo("/~krish"), "/~krish");
  assert.equal(
    normalizeReturnTo("/subscriptions?status=subscribed"),
    "/subscriptions?status=subscribed",
  );
});

test("normalizeReturnTo rejects unsafe redirects", () => {
  assert.equal(normalizeReturnTo("//evil.example"), "/");
  assert.equal(normalizeReturnTo("https://evil.example"), "/");
  assert.equal(normalizeReturnTo(null), "/");
});

test("isValidEmail accepts a normal address", () => {
  assert.equal(isValidEmail("krish@example.com"), true);
});

test("isValidEmail rejects malformed or oversized addresses", () => {
  assert.equal(isValidEmail("not-an-email"), false);
  assert.equal(isValidEmail(`${"a".repeat(250)}@x.com`), false);
});

test("resolveVerifiedSubscriptionUserId only trusts the signed-in user's own email", () => {
  assert.equal(
    resolveVerifiedSubscriptionUserId({
      sessionUserId: "user_123",
      sessionEmail: "Krish@Example.com",
      targetEmail: "krish@example.com",
    }),
    "user_123",
  );

  assert.equal(
    resolveVerifiedSubscriptionUserId({
      sessionUserId: "user_123",
      sessionEmail: "krish@example.com",
      targetEmail: "friend@example.com",
    }),
    null,
  );

  assert.equal(
    resolveVerifiedSubscriptionUserId({
      sessionUserId: null,
      sessionEmail: "krish@example.com",
      targetEmail: "krish@example.com",
    }),
    null,
  );
});

test("doesSessionOwnSubscriber matches by user id or verified email", () => {
  assert.equal(
    doesSessionOwnSubscriber({
      sessionUserId: "user_123",
      sessionEmail: "krish@example.com",
      subscriberUserId: "user_123",
      subscriberEmail: "friend@example.com",
    }),
    true,
  );

  assert.equal(
    doesSessionOwnSubscriber({
      sessionUserId: "user_123",
      sessionEmail: "Krish@Example.com",
      subscriberUserId: null,
      subscriberEmail: "krish@example.com",
    }),
    true,
  );

  assert.equal(
    doesSessionOwnSubscriber({
      sessionUserId: "user_123",
      sessionEmail: "krish@example.com",
      subscriberUserId: null,
      subscriberEmail: "friend@example.com",
    }),
    false,
  );
});
