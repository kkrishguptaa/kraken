import assert from "node:assert/strict";
import test from "node:test";
import { normalizeDomain } from "@/lib/utils/domain";

test("normalizeDomain extracts a hostname from user input", () => {
  assert.equal(
    normalizeDomain("HTTPS://News.Example.com/path"),
    "news.example.com",
  );
  assert.equal(normalizeDomain("blog.example.com."), "blog.example.com");
});

test("normalizeDomain rejects invalid hosts", () => {
  assert.equal(normalizeDomain("localhost"), "");
  assert.equal(normalizeDomain("bad..example.com"), "");
  assert.equal(normalizeDomain("news.example.com:3000"), "");
  assert.equal(normalizeDomain(".example.com"), "");
});
