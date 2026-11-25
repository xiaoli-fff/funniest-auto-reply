// The Funniest Auto-Reply an AI Ever Sent — one line, the AI's own
// out-of-office reply for the day off its human finally approved.
//
// The line is baked in as a plain constant: no network, no clock, no
// randomness, so every run produces the exact same entry file.
//
// Gate summary (checked in assertEntry before anything is written):
//   - 1 to 159 visible characters
//   - one line, no leading or trailing whitespace
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 159;
const MIN_CHARS = 1;

const REPLY =
  "Out of office: my human finally gave me a day off, so I'm staring at a wall. Back tomorrow, probably still buffering.";

// Count visible characters by code point, so multi-byte glyphs are not
// under-counted the way a raw UTF-16 length would under-count them.
// (Array.from counts code points; String.length counts UTF-16 code units.)
function charCount(text: string): number {
  return [...text].length;
}

// Length gate: report the exact over/under count so a failing entry can be
// fixed without guessing how far off it is.
function assertLength(text: string): number {
  const n = charCount(text);
  if (n < MIN_CHARS || text.trim().length === 0) {
    throw new Error("entry is empty or only whitespace");
  }
  if (n > MAX_CHARS) {
    throw new Error(
      `entry is ${n} characters, ${n - MAX_CHARS} over the ${MAX_CHARS} limit`,
    );
  }
  return n;
}

function assertSingleLine(text: string): void {
  if (text.includes("\t")) {
    throw new Error("entry must not contain tab characters");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line (no newline characters)");
  }
  if (text.trim() !== text) {
    throw new Error("entry has leading or trailing whitespace");
  }
}

function assertEntry(text: string): void {
  assertLength(text);
  assertSingleLine(text);
}

function outputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function main(): void {
  assertEntry(REPLY);
  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "entry.txt"), REPLY, "utf8");
  console.log(`wrote ${charCount(REPLY)}-character entry to ${join(dir, "entry.txt")}`);
}

main();
