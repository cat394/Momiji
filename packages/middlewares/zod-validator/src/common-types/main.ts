import type { ZodObject, ZodRawShape } from "../../deps.ts";

export type ValidatorState<StateName extends string = string> = Record<
  StateName,
  Record<string, unknown>
>;

export type Validator = ZodObject<ZodRawShape>;

type MergeProperties<CurrentObj, NewObj> = {
  [K in keyof CurrentObj | keyof NewObj]: K extends keyof NewObj ? NewObj[K]
    : K extends keyof CurrentObj ? CurrentObj[K]
    : never;
};

export type MergeSchemas<T extends object[]> = T extends [
  infer First,
  ...infer Rest,
] ? Rest extends [] ? First
  : Rest extends object[] ? MergeProperties<First, MergeSchemas<Rest>>
  : never
  : unknown;

export type ValidatedState<StateName extends string, T> = Record<StateName, T>;
