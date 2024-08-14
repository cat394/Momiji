import { type Middleware, type ParseOptions, queryString } from "../deps.ts";
import type { ParsedQueryState } from "./types.ts";

/**
 * `queryParser` is a middleware that parses the query string from the request URL
 * and stores the result in `ctx.state.parsedQuery`.
 *
 * This middleware is useful for extracting and handling query parameters
 * in an Oak application.
 *
 * By default, numbers and booleans are automatically converted, this can be changed with options, see the [query-string repository](https://github.com/sindresorhus/query-string) for more information on options.
 *
 * @example
 * import { Application, type Context } from "@oak/oak";
 * import { queryParser, type ParsedQuery } from "@momiji/query-parser";
 *
 * const app = new Application();
 *
 * app.use(queryParser());
 *
 * app.get('/', (ctx: Context<ParsedQuery>) => {
 *     const { parsedQuery } = ctx.state;
 *     console.log(parsedQuery);
 * });
 *
 * // Example request:
 * fetch('/?param1=value&param2=1&param3=true');
 *
 * // Output:
 * { param1: 'value', param2: 1, param3: true  }
 *
 * @returns {Middleware<ParsedQueryState>} Returns the query parser middleware.
 */
export const queryParser = (
  customOptions: ParseOptions = {},
): Middleware<ParsedQueryState> => {
  const defaultOptions: ParseOptions = {
    parseNumbers: true,
    parseBooleans: true,
  };
  const options = {
    ...defaultOptions,
    ...customOptions,
  };
  return async (ctx, next) => {
    const search = ctx.request.url.search;
    ctx.state.parsedQuery = queryString.parse(search, options);
    await next();
  };
};
