import { assertType, type IsExact, z } from "../../deps.ts";
import type { CustomStateNames } from "../constants.ts";
import type { ValidatedQueryState } from "./types.ts";

const queryValidatorA = z
  .object({
    p1: z.string(),
    p2: z.number(),
    p3: z.boolean(),
  })
  .partial();

const queryValidatorB = z
  .object({
    p4: z.string(),
    p5: z.boolean(),
  })
  .partial();

type IQueryValidationA = z.infer<typeof queryValidatorA>;

type IQueryValidationB = z.infer<typeof queryValidatorB>;

Deno.test("Query validator type test", async (t) => {
  await t.step("single validator query state", () => {
    type SingleQueryState = ValidatedQueryState<[IQueryValidationA]>;
    type ExpectedBodyState = Record<
      CustomStateNames.VALIDATED_QUERY,
      IQueryValidationA
    >;

    assertType<IsExact<SingleQueryState, ExpectedBodyState>>(true);
  });

  await t.step("multiple validator query state", () => {
    type MultiQueryState = ValidatedQueryState<
      [IQueryValidationA, IQueryValidationB]
    >;

    type ExpectedQueryState = Record<
      CustomStateNames.VALIDATED_QUERY,
      IQueryValidationA & IQueryValidationB
    >;

    assertType<IsExact<MultiQueryState, ExpectedQueryState>>(true);
  });
});
