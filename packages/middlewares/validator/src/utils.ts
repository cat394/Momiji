import type { ZodSchema } from "../deps.ts";
import type { Validator } from "./common-types/main.ts";

/**
 * `mergeSchemas` is a utility function that merges multiple Zod schemas
 * into a single schema. This is particularly useful when you want to apply
 * multiple validation logics at once, even when each schema defines different
 * fields or conditions.
 *
 * By merging schemas, you can create a composite validation schema that
 * encompasses the rules from all the provided schemas.
 *
 * @example
 * import { z } from "zod";
 * import { mergeSchemas } from "./path-to-utils";
 *
 * const validatorA = z.object({
 *   p1: z.string(),
 *   p2: z.number()
 * });
 *
 * const validatorB = z.object({
 *   p3: z.boolean()
 * });
 *
 * const mergedSchema = mergeSchemas([validatorA, validatorB]);
 *
 * const result = mergedSchema.safeParse({ p1: "string", p2: 123, p3: true });
 *
 * if (!result.success) {
 *   console.log("Validation errors:", result.error.errors);
 * }
 *
 * console.log("Valid data:", result.data);
 *
 * @param {Validator[]} schemas - An array of Zod schemas to merge.
 * @returns {ZodSchema} Returns the merged Zod schema.
 */
export const mergeSchemas = (schemas: Validator[]): ZodSchema => {
  let mergedSchema = schemas[0];
  for (let index = 1; index < schemas.length; index++) {
    mergedSchema = mergedSchema.merge(schemas[index]);
  }
  return mergedSchema;
};
