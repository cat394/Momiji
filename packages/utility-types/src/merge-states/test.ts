import type { MergeStates } from "./main.ts";
import { assertType, type IsExact } from "../../deps.ts";

Deno.test("MergeStates type test", async (t) => {
  await t.step("single state", () => {
    type SingleState = { p1: string };

    type Merged = MergeStates<[SingleState]>;

    assertType<IsExact<Merged, SingleState>>(true);
  });

  await t.step("multiple state", () => {
    type State1 = {
      p1: string;
    };

    type State2 = {
      p2: number;
    };

    type Merged = MergeStates<[State1, State2]>;

    assertType<IsExact<Merged, State1 & State2>>(true);
  });

  await t.step("duplicated state names", () => {
    type State1 = {
      p1: string;
    };

    type State2 = {
      p1: number;
      p2: string;
    };

    type Merged = MergeStates<[State1, State2]>;

    type ExpectedWarning = "The state name *p1* is duplicated!";

    assertType<IsExact<Merged, ExpectedWarning>>(true);
  });
});
