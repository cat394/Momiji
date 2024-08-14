/**
 * HTTP methods that are typically allowed in CORS requests.
 */
export type BaseMethods = "GET" | "HEAD" | "PUT" | "PATCH" | "POST" | "DELETE";

/**
 * The result of an origin validation function, indicating whether the origin is allowed.
 */
type OriginFunctionResult = boolean | void;

/**
 * A function that determines if a given origin is allowed.
 * @param origin - The origin URL from the incoming request.
 * @returns A boolean indicating if the origin is allowed, or a promise that resolves to a boolean.
 */
type OriginFunction = (
  origin: string,
) => OriginFunctionResult | Promise<OriginFunctionResult>;

/**
 * Options for configuring the CORS middleware.
 *
 * @template Methods - The allowed HTTP methods, defaults to the common CORS methods.
 */
export type CorsOptions<Methods extends BaseMethods = BaseMethods> = Partial<{
  /**
   * The origin(s) that are allowed to access the resources. This can be a string, an array of strings,
   * or a function that returns a boolean or a promise that resolves to a boolean.
   */
  origin: string | string[] | OriginFunction;

  /**
   * The HTTP methods that are allowed for CORS requests. Defaults to `["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]`.
   */
  allowMethods: Methods[];

  /**
   * The headers that are allowed to be sent in the CORS request.
   */
  allowHeaders: string[];

  /**
   * The headers that are exposed to the client in the CORS response.
   */
  exposeHeaders: string[];

  /**
   * Whether credentials (cookies, authorization headers, etc.) are allowed in the request.
   */
  credentials: boolean;

  /**
   * The maximum time (in seconds) that the results of a preflight request can be cached.
   */
  maxAge: number;
}>;
