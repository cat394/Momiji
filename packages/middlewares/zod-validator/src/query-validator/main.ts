import type { MergeStates, Middleware, ParsedQueryState } from "../../deps.ts";
import type { Validator } from "../common-types/main.ts";
import { mergeSchemas } from "../utils.ts";
import { CustomStateNames } from "../constants.ts";
import { MomijiInvalidQueryError } from "../error-class/main.ts";
import type { ValidatedQueryState } from "./types.ts";

/**
 * 	`validateQuery` is a middleware that merges multiple Zod schemas
 * 	and validates the query parameters using the combined schema.
 *
 * 	This middleware validates the query parameters present in `ctx.state.query`
 * 	and stores the validated data in `ctx.state.validatedQuery`.
 *
 * @note
 * This middleware requires @mommiji/query-parser[.
 *
 * 	@note
 * 	Make the query parameter validation schema optional with `ZodSchema.partial()`!
 *
 * 	@example
 * 	import { Application, Router, type Context } from "@oak/oak";
 * 	import { queryParser } from "@momiji/query-parser";
 * 	import { validateQuery, ValidatedQueryState } from "@momiji/validator";
 *
 * 	const app = new Application();
 *
 * 	app.use(queryParser());
 *
 * 	const router = new Router();
 *
 * 	const validatorA = z.object({
 * 		p1: z.string(),
 * 		p2: z.number(),
 * 		p3: z.boolean()
 * 	}).partial();
 *
 * 	type AType = z.infer<typeof validatorA>;
 *
 * 	router.post(
 * 		'/endpoint',
 * 		validateQuery(validatorA),
 * 		(ctx: Context<ValidatedQueryState<[AType]>>) => {
 * 		const { p1, p2, p3 } = ctx.state.validatedQuery;
 *    // validatedQuery = {
 *    //  p1?: string | undefined,
 *    //  p2?: number | undefined,
 *    //  p3: boolean | undefined
 *    // }
 * 		}
 * 	);
 *
 * 	@param {Validator[]} schemas - A list of Zod schemas to use for validation.
 * 	@returns {Middleware<MergeStates<[ParsedQueryState, ValidatedQueryState]>>} Returns the Zod validation middleware for query parameters.
 */
export const validateQuery = (
  ...schemas: Validator[]
): Middleware<MergeStates<[ParsedQueryState, ValidatedQueryState]>> => {
  return async (ctx, next) => {
    const mergedSchema = mergeSchemas(schemas);
    const result = mergedSchema.safeParse(ctx.state.parsedQuery);

    if (!result.success) {
      throw new MomijiInvalidQueryError(result.error);
    }

    ctx.state.validatedQuery;

    ctx.state[CustomStateNames["VALIDATED_QUERY"]] = result.data as Partial<
      object
    >;

    await next();
  };
};
