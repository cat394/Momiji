import { assertEquals, z } from "../../deps.ts";
import { formatZodError } from "./main.ts";

Deno.test("formatZodError function test", async (t) => {
  await t.step("should format invalid_type errors correctly", () => {
    const schema = z.object({
      p1: z.string(),
      p2: z.number(),
    });

    const result = schema.safeParse({ p1: 123, p2: "invalid" });

    if (!result.success) {
      const formattedErrors = formatZodError(result.error);
      assertEquals(formattedErrors, [
        {
          code: "invalid_type",
          path: "p1",
          message: "Expected string, received number",
          expected: "string",
          received: "number",
        },
        {
          code: "invalid_type",
          path: "p2",
          message: "Expected number, received string",
          expected: "number",
          received: "string",
        },
      ]);
    }
  });

  await t.step("should format invalid_enum_value errors correctly", () => {
    const schema = z.enum(["item1", "item2", "item3"]);
    const result = schema.safeParse("invalid value");

    if (!result.success) {
      const formattedErrors = formatZodError(result.error);
      assertEquals(formattedErrors, [
        {
          code: "invalid_enum_value",
          path: "",
          message: "Invalid enum value. Expected one of: item1, item2, item3",
          options: ["item1", "item2", "item3"],
        },
      ]);
    }
  });

  await t.step("should format too_small errors correctly", () => {
    const schema = z.bigint().min(10n);
    const result = schema.safeParse(5n);

    if (!result.success) {
      const formattedErrors = formatZodError(result.error);
      assertEquals(formattedErrors, [
        {
          code: "too_small",
          path: "",
          message: "Value is too small. Minimum: 10n",
          minimum: "10n",
          inclusive: true,
        },
      ]);
    }
  });

  await t.step("should format too_big errors correctly", () => {
    const schema = z.bigint().max(100n);
    const result = schema.safeParse(150n);

    if (!result.success) {
      const formattedErrors = formatZodError(result.error);
      assertEquals(formattedErrors, [
        {
          code: "too_big",
          path: "",
          message: "Value is too large. Maximum: 100n",
          maximum: "100n",
          inclusive: true,
        },
      ]);
    }
  });

  await t.step("should handle nested object validation errors", () => {
    const schema = z.object({
      p1: z.string(),
      p2: z.object({
        p3: z.number(),
      }),
    });

    const result = schema.safeParse({ p1: "valid", p2: { p3: "invalid" } });

    if (!result.success) {
      const formattedErrors = formatZodError(result.error);
      assertEquals(formattedErrors, [
        {
          code: "invalid_type",
          path: "p2.p3",
          message: "Expected number, received string",
          expected: "number",
          received: "string",
        },
      ]);
    }
  });
});
