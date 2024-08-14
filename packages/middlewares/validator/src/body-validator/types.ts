import type { CustomStateNames } from "../constants.ts";
import type { MergeSchemas, ValidatedState } from "../common-types/main.ts";

export type ValidatedBodyState<T extends object[] = object[]> = ValidatedState<
  CustomStateNames.VALIDATED_BODY,
  MergeSchemas<T>
>;
