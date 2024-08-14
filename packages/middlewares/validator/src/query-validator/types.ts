import type { CustomStateNames } from "../constants.ts";
import type { MergeSchemas, ValidatedState } from "../common-types/main.ts";

export type ValidatedQueryState<T extends object[] = object[]> = ValidatedState<
  CustomStateNames.VALIDATED_QUERY,
  Partial<MergeSchemas<T>>
>;
