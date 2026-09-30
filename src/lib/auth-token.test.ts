import { describe, expect, it } from "vitest";
import { isTokenExpired, tokenExpiry } from "./auth-token";

const jwt = (payload: object) => `header.${btoa(JSON.stringify(payload)).replace(/=+$/, "")}.signature`;

describe("tokenExpiry", () => {
  it("reads the exp claim in milliseconds", () => {
    expect(tokenExpiry(jwt({ exp: 1_700_000_000 }))).toBe(1_700_000_000_000);
  });

  it("returns null for tokens without exp or malformed tokens", () => {
    expect(tokenExpiry(jwt({ userId: "1" }))).toBeNull();
    expect(tokenExpiry("garbage")).toBeNull();
  });
});

describe("isTokenExpired", () => {
  it("compares exp against now", () => {
    const token = jwt({ exp: 1000 });
    expect(isTokenExpired(token, 999_000)).toBe(false);
    expect(isTokenExpired(token, 1_000_000)).toBe(true);
  });

  it("treats tokens without exp as not expired", () => {
    expect(isTokenExpired(jwt({}))).toBe(false);
  });
});
