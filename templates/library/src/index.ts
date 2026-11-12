/**
 * A dependency-free UUIDv7 generator, as an example library.
 *
 * UUIDv7 (RFC 9562) encodes a 48-bit Unix millisecond timestamp in its leading
 * bits, so the IDs sort chronologically as strings — handy as database keys.
 * This implementation adds a monotonic counter so IDs minted within the same
 * millisecond still sort in creation order.
 *
 * Every exported symbol carries an explicit type. That is the discipline JSR
 * enforces at publish time (no "slow types") and that `isolatedDeclarations`
 * enforces locally, so declarations generate on tsdown's fast path.
 */

let lastTimestamp = 0;
let monotonicCounter = 0;

const UUID_V7_PATTERN: RegExp =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Generates a new UUIDv7 string, monotonic within a single process. */
export function uuidv7(): string {
  const bytes = new Uint8Array(16);
  const now = Date.now();

  const timestamp = now > lastTimestamp ? now : lastTimestamp + 1;
  monotonicCounter = timestamp === lastTimestamp ? monotonicCounter + 1 : 0;
  lastTimestamp = timestamp;

  bytes[0] = (timestamp / 2 ** 40) & 0xff;
  bytes[1] = (timestamp / 2 ** 32) & 0xff;
  bytes[2] = (timestamp / 2 ** 24) & 0xff;
  bytes[3] = (timestamp / 2 ** 16) & 0xff;
  bytes[4] = (timestamp / 2 ** 8) & 0xff;
  bytes[5] = timestamp & 0xff;

  const rand = crypto.getRandomValues(new Uint8Array(10));

  // Version (0b0111) in the high nibble of byte 6, then 12 counter bits.
  bytes[6] = 0x70 | ((monotonicCounter >>> 8) & 0x0f);
  bytes[7] = monotonicCounter & 0xff;
  // Variant (0b10) in the high bits of byte 8, then 62 random bits.
  bytes[8] = 0x80 | (rand[0]! & 0x3f);
  for (let i = 1; i < 10; i++) {
    bytes[8 + i] = rand[i]!;
  }

  return bytesToUuidString(bytes);
}

/** Returns true if `value` is a well-formed UUIDv7 string. */
export function isUuidv7(value: string): boolean {
  return UUID_V7_PATTERN.test(value);
}

/**
 * Extracts the embedded creation time from a UUIDv7 string.
 * @throws {RangeError} if `uuid` is not a valid UUIDv7.
 */
export function extractTimestamp(uuid: string): Date {
  if (!isUuidv7(uuid)) {
    throw new RangeError(`Not a valid UUIDv7 string: ${uuid}`);
  }
  const hex = uuid.replace(/-/g, "").slice(0, 12);
  return new Date(Number.parseInt(hex, 16));
}

function bytesToUuidString(bytes: Uint8Array): string {
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}
