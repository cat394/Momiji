import { assertType, type IsExact, z } from "../../deps.ts";
import type { ValidatedBodyState } from "./types.ts";
import type { CustomStateNames } from "../constants.ts";

const validatorA = z.object({
  p1: z.string(),
  p2: z.number(),
  p3: z.boolean(),
});

const validatorB = z.object({
  p4: z.array(z.string()),
  p5: z.object({
    cp1: z.string(),
    cp2: z.number(),
  }),
});

type IBodyValidationA = z.infer<typeof validatorA>;

type IBodyValidationB = z.infer<typeof validatorB>;

Deno.test("Body validator type test", async (t) => {
  await t.step("single validator body state", () => {
    type SingleBodyState = ValidatedBodyState<[IBodyValidationA]>;
    type ExpectedBodyState = Record<
      CustomStateNames.VALIDATED_BODY,
      IBodyValidationA
    >;

    assertType<IsExact<SingleBodyState, ExpectedBodyState>>(true);
  });

  await t.step("multiple validator body state", () => {
    type MultiBodyState = ValidatedBodyState<
      [IBodyValidationA, IBodyValidationB]
    >;
    type ExpectedBodyState = Record<
      CustomStateNames.VALIDATED_BODY,
      IBodyValidationA & IBodyValidationB
    >;

    assertType<IsExact<MultiBodyState, ExpectedBodyState>>(true);
  });
});
