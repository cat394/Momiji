import type { Validator } from "../common-types/main.ts";
import type { Middleware } from "../../deps.ts";
import { mergeSchemas } from "../utils.ts";
import { MomijiInvalidBodyError } from "../error-class/main.ts";
import type { ValidatedBodyState } from "./types.ts";

/**
 * `validateBody` is a middleware that validates the request body using the specified
 * Zod schemas, and stores the validated data in `ctx.state.validatedBody`.
 *
 * This middleware can handle different body types (JSON only) and can apply
 * multiple schemas by merging them into one using the `mergeSchemas` function.
 *
 * @example
 * import { Router, type Context } from "@oak/oak";
 * import { validateBody, ValidatedBodyState } from "@momiji/zod-validator";
 *
 * const router = new Router();
 *
 * const validatorA = z.object({
 *     p1: z.string(),
 *     p2: z.number()
 * });
 *
 * const validatorB = z.object({
 *     p3: z.boolean()
 * });
 *
 * type AType = z.infer<typeof validatorA>;
 * type BType = z.infer<typeof validatorB>;
 *
 * router.post(
 *  '/endpoint',
 *  validateBody(validatorA, validatorB),
 *  (ctx: Context<ValidatedBodyState<[AType, BType]>>) => {
 *    const { p1, p2, p3 } = ctx.state.validatedBody;
 *    // p1 is string
 *    // p2 is number
 *    // p3 is boolean
 *    // No need to do validation in your controllers! They can be used as a trusted source!
 *  }
 * );
 *
 * @param {Validator[]} [schemas] - Additional Zod schemas to use for validation.
 * @returns {Middleware<ValidatedBodyState>} Returns the Zod validation middleware for request bodies.
 */
export const validateBody = (
  ...schemas: Validator[]
): Middleware<ValidatedBodyState> => {
  return async (ctx, next) => {
    const body = await ctx.request.body.json();

    const mergedSchema = mergeSchemas(schemas);

    const result = mergedSchema.safeParse(body);

    if (!result.success) {
      throw new MomijiInvalidBodyError(result.error);
    }

    ctx.state.validatedBody = result.data;

    await next();
  };
};
