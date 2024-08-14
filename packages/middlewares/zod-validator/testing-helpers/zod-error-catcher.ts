import { type Middleware, Status } from "../deps.ts";
import { MomijiValidationError } from "../src/error-class/main.ts";
import { formatZodError } from "../src/format-zod-error/main.ts";
import { t_createParamError } from "./create-error-message.ts";

export const t_zodErrorCatcher = (): Middleware => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof MomijiValidationError) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = t_createParamError(formatZodError(err.zodErrors));
    }
  }
};
