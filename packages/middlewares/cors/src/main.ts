import { type Middleware, Status } from "@oak/oak";
import { Symbols } from "./constants.ts";
import type { BaseMethods, CorsOptions } from "./types.ts";

/**
 * Generates a CORS (Cross-Origin Resource Sharing) middleware for the Oak framework.
 * This middleware sets appropriate CORS headers based on the provided options.
 *
 * @template Methods - The allowed HTTP methods.
 * @param {CorsOptions<Methods>} [customOptions={}] - The configuration options for the CORS middleware.
 * @returns {Middleware} The configured CORS middleware.
 *
 * @description The default options are:
 * - `origin`: "*" (all origins are allowed)
 * - `allowMethods`: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]
 * - `allowHeaders`: ["Content-Type", "Authorization"]
 * - `exposeHeaders`: [] (no headers are exposed)
 * - `credentials`: false (credentials are not supported)
 * - `maxAge`: undefined (no max age is set)
 *
 * @example
 * import { Application } from "@oak/oak";
 * import { cors, type CorsOptions } from '@kokomi-oak/cors';
 *
 * const corsCustomOptions: CorsOptions = {
 *   origin: "https://example.com",
 *   allowMethods: ["GET", "POST"],
 *   allowHeaders: ["Content-Type"],
 *   credentials: true,
 *   maxAge: 86400,
 * };
 *
 * const app = new Application();
 *
 * app.use(cors(corsOptions));
 */
export const cors = <Methods extends BaseMethods>(
  customOptions: CorsOptions<Methods> = {},
): Middleware => {
  const defaultOptions: CorsOptions = {
    origin: Symbols.WILD_CARD,
    allowMethods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: [],
    credentials: false,
    maxAge: undefined,
  };

  const options: CorsOptions = {
    ...defaultOptions,
    ...customOptions,
  };

  return async (ctx, next) => {
    const setHeader = (key: string, value: string) => {
      ctx.response.headers.set(key, value);
    };

    const requestOrigin = ctx.request.headers.get("Origin");

    if (requestOrigin) {
      let isAllowOrigin: boolean = false;

      if (options.origin) {
        if (typeof options.origin === "string") {
          if (
            options.origin === requestOrigin ||
            options.origin === Symbols.WILD_CARD
          ) {
            isAllowOrigin = true;
          }
        } else if (typeof options.origin === "function") {
          const result = await Promise.resolve(options.origin(requestOrigin));
          if (result === true) {
            isAllowOrigin = true;
          }
        } else if (options.origin.includes(requestOrigin)) {
          isAllowOrigin = true;
        }
      }

      if (isAllowOrigin) {
        setHeader(
          "Access-Control-Allow-Origin",
          options.origin === Symbols.WILD_CARD
            ? Symbols.WILD_CARD
            : requestOrigin,
        );

        if (options.credentials && options.origin !== Symbols.WILD_CARD) {
          setHeader("Access-Control-Allow-Credentials", "true");
        }

        if (options.exposeHeaders?.length) {
          setHeader(
            "Access-Control-Expose-Headers",
            options.exposeHeaders.join(Symbols.CORS_HEADER_SEPARATOR),
          );
        }

        if (ctx.request.method === "OPTIONS") {
          if (options.allowMethods) {
            setHeader(
              "Access-Control-Allow-Methods",
              options.allowMethods.join(Symbols.CORS_HEADER_SEPARATOR),
            );
          }

          if (options.allowHeaders) {
            setHeader(
              "Access-Control-Allow-Headers",
              options.allowHeaders.join(Symbols.CORS_HEADER_SEPARATOR),
            );
          }

          if (options.maxAge) {
            setHeader("Access-Control-Max-Age", options.maxAge.toString());
          }

          ctx.response.status = Status.NoContent;
          return;
        }

        if (options.origin !== Symbols.WILD_CARD) {
          setHeader("Vary", "Origin");
        }
      }
    }
    await next();
  };
};
