import type { CustomStateNames } from "./constants.ts";

/**
 * Used to type-safely access the parsed query parameter state.
 *
 * @example
 * import { Application, type Context } from "@oak/oak";
 * import { qureyParser, type ParsedQueryState } from "@momiji/query-parser";
 *
 * const app = new Application();
 *
 * app.use(queryParser());
 *
 * app.use(async (ctx: Context<ParsedQueryState>) => {
 *  const { parsedQuery } = ctx.state;
 * })
 */
export type ParsedQueryState = Record<CustomStateNames.PARSED_QUREY, unknown>;
