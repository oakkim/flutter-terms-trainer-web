import { describe, expect, test } from "vitest";

import { getCategoryLabel } from "@/lib/presentation";

describe("presentation helpers", () => {
  test("returns a localized label when known and falls back otherwise", () => {
    expect(getCategoryLabel("widget")).toBe("위젯");
    expect(getCategoryLabel("custom-category")).toBe("custom-category");
  });
});
