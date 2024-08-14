import { assertEquals, assertInstanceOf, z, ZodError } from "../../deps.ts";
import {
  MomijiInvalidBodyError,
  MomijiInvalidQueryError,
  MomijiValidationError,
} from "./main.ts";

const validatorA = z.object({
  p1: z.string(),
});

type AType = z.infer<typeof validatorA>;

Deno.test("InvalidRequestError test", async (t) => {
  await t.step("should create an instance with the correct properties", () => {
    const zodError = new ZodError([]);
    const error = new MomijiValidationError("Test error", zodError);

    assertInstanceOf(error, Error);
    assertEquals(error.zodErrors, zodError);
    assertEquals(error.message, "Test error");
  });
});

Deno.test("InvalidBodyError test", async (t) => {
  await t.step("should create an InvalidBodyError with a ZodError", () => {
    const invalidData: AType = { p1: "value" };
    const parseResult = validatorA.safeParse(invalidData);

    if (parseResult.success === false) {
      const error = new MomijiInvalidBodyError(parseResult.error);
      assertInstanceOf(error, MomijiValidationError);
      assertInstanceOf(error, MomijiInvalidBodyError);
      assertEquals(error.message, "Invalid body data");
      assertEquals(error.zodErrors, parseResult.error);
    }
  });
});

Deno.test("InvalidQueryError test", async (t) => {
  await t.step("should create an InvalidQueryError with a ZodError", () => {
    const invalidData = { p1: 1 };
    const parseResult = validatorA.safeParse(invalidData);

    if (parseResult.success === false) {
      const error = new MomijiInvalidQueryError(parseResult.error);
      assertInstanceOf(error, MomijiValidationError);
      assertInstanceOf(error, MomijiInvalidQueryError);
      assertEquals(error.message, "Invalid query parameters");
      assertEquals(error.zodErrors, parseResult.error);
    }
  });
});
