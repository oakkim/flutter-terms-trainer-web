import { describe, expect, test } from "vitest";

import { shuffleArray } from "@/lib/order";

describe("shuffleArray", () => {
  test("returns a new shuffled array without mutating the input", () => {
    const original = ["A", "B", "C", "D"];
    const randomValues = [0.2, 0.8, 0.1];

    const shuffled = shuffleArray(original, () => randomValues.shift() ?? 0);

    expect(shuffled).toEqual(["B", "D", "C", "A"]);
    expect(original).toEqual(["A", "B", "C", "D"]);
  });
});
