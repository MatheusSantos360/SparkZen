import { describe, expect, test } from "vitest";
import { isValidRoute } from "../../src/core/routing/isValidRoute.js";

describe("isValidRoute", () => {
  test("should return true for valid routes", () => {
    const validRoute = {
      default: () => { },
    }

    expect(isValidRoute(validRoute)).toBe(true);
  });

  test("should return false for invalid routes", () => {
    const alsoInvalidRoute = { default: "not a function" };

    expect(isValidRoute(alsoInvalidRoute)).toBe(false);
  });
});
