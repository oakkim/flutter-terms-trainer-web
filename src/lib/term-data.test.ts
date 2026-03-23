import { describe, expect, test } from "vitest";

import {
  baseTerms,
  mainBranchRecommendedTerms,
  moduleAAddedTerms2,
  moduleAExtraTerms,
} from "@/data/seed-terms";
import { createTermCatalog, FORBIDDEN_TERMS, validateAuthoredTerms } from "@/lib/term-data";

describe("term catalog normalization", () => {
  test("merges duplicate Image.asset prompts and keeps exact catalog counts", () => {
    const catalog = createTermCatalog([
      baseTerms,
      moduleAExtraTerms,
      moduleAAddedTerms2,
      mainBranchRecommendedTerms,
    ]);

    expect(catalog.terms).toHaveLength(59);
    expect(catalog.quizItems).toHaveLength(60);

    const imageAsset = catalog.terms.find((term) => term.term === "Image.asset");
    const materialApp = catalog.terms.find((term) => term.term === "MaterialApp");

    expect(imageAsset).toMatchObject({
      term: "Image.asset",
      category: "asset",
    });
    expect(imageAsset?.quizPrompts).toEqual([
      "assets 폴더에 있는 달, 구름, 로고 같은 이미지를 화면에 표시할 때 자주 쓰는 생성자는?",
      "assets 폴더에 있는 로컬 이미지를 가장 간단하게 바로 표시할 때 자주 쓰는 생성자는?",
    ]);
    expect(materialApp).toMatchObject({
      term: "MaterialApp",
      category: "app",
    });
  });

  test("rejects duplicate ids, blank fields, and forbidden async terms", () => {
    const errors = validateAuthoredTerms([
      {
        id: "duplicate",
        term: "Widget",
        category: "widget",
        quizPrompt: "질문",
        description: "설명",
      },
      {
        id: "duplicate",
        term: "Future",
        category: "async",
        quizPrompt: "질문",
        description: "",
      },
    ]);

    expect(errors).toEqual(
      expect.arrayContaining([
        "Duplicate authored id: duplicate",
        "duplicate has an empty description.",
        "Forbidden async term included: Future",
      ]),
    );
  });

  test("omits async terms from the seed content entirely", () => {
    const catalog = createTermCatalog();

    expect(catalog.terms.filter((term) => FORBIDDEN_TERMS.has(term.term))).toHaveLength(0);
  });
});
