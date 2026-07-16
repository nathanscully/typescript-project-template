import { describe, expect, it } from "vitest";

import { extractTimestamp, isUuidv7, uuidv7 } from "./index.ts";

describe("uuidv7", () => {
  it("generates a valid UUIDv7 string", () => {
    expect(isUuidv7(uuidv7())).toBe(true);
  });

  it("generates unique IDs that sort in creation order", () => {
    const ids = Array.from({ length: 1000 }, () => uuidv7());
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual(ids);
  });

  it("round-trips the embedded timestamp", () => {
    // The monotonic counter can push the encoded time a few ms past the wall
    // clock under a burst, so assert closeness rather than an exact bound.
    const now = Date.now();
    const extracted = extractTimestamp(uuidv7()).getTime();
    expect(Math.abs(extracted - now)).toBeLessThan(1000);
  });

  it("rejects strings that are not UUIDv7", () => {
    expect(isUuidv7("not-a-uuid")).toBe(false);
    expect(isUuidv7("00000000-0000-4000-8000-000000000000")).toBe(false);
    expect(() => extractTimestamp("not-a-uuid")).toThrow(RangeError);
  });
});
