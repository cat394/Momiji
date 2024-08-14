export type BaseMethods = "GET" | "HEAD" | "PUT" | "PATCH" | "POST" | "DELETE";

type OriginFunctionResult = boolean | void;

type OriginFunction = (
  origin: string,
) => OriginFunctionResult | Promise<OriginFunctionResult>;

export type CorsOptions<Methods extends BaseMethods = BaseMethods> = Partial<{
  origin: string | string[] | OriginFunction;
  allowMethods: Methods[];
  allowHeaders: string[];
  exposeHeaders: string[];
  credentials: boolean;
  maxAge: number;
}>;
