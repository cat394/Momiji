import type { ZodError } from "../../deps.ts";

/**
 * This error class is thrown by the `validateBody` middleware when the request body fails validation.
 * It extends the `MomijiValidationError` class and provides a specific error message indicating
 * that the body data is invalid.
 *
 * @example
 * import { Application } from "@oak/oak";
 * import { MomijiValidationError, MomijiInvalidBodyError } from "@momiji/validator";
 *
 * const app = new Application();
 *
 * app.use(async (ctx, next) => {
 *   try {
 *     await next();
 *   } catch (err) {
 *     if (err instanceof MomijiValidationError) {
 *       if (err instanceof MomijiInvalidBodyError) {
 *         // Handle invalid request body error
 *       }
 *     }
 *   }
 * });
 */
export class MomijiValidationError extends Error {
  public zodErrors: ZodError;

  /**
   * Creates an instance of MomijiValidationError.
   *
   * @param {string} message - The error message.
   * @param {ZodError} zodErrors - The Zod error object containing detailed validation errors.
   */
  constructor(message: string, zodErrors: ZodError) {
    super(message);
    this.zodErrors = zodErrors;
    this.name = this.constructor.name;
  }
}

/**
/**
 * This error class is thrown by the `validateBody` middleware when the request body fails validation.
 * It extends the `MomijiValidationError` class and provides a specific error message indicating
 * that the body data is invalid.
 *
 * @example
 * import { Application } from "@oak/oak";
 * import { MomijiValidationError, MomijiInvalidBodyError } from "@momiji/validator";
 *
 * const app = new Application();
 *
 * app.use(async (ctx, next) => {
 *   try {
 *     await next();
 *   } catch (err) {
 *     if (err instanceof MomijiValidationError) {
 *       if (err instanceof MomijiInvalidBodyError) {
 *         // Handle invalid request body error
 *       }
 *     }
 *   }
 * });
 *
 * */
export class MomijiInvalidBodyError extends MomijiValidationError {
  /**
   * Creates an instance of MomijiInvalidBodyError.
   *
   * @param {ZodError} zodError - The Zod error object containing detailed validation errors related to the request body.
   */
  constructor(zodError: ZodError) {
    super("Invalid body data", zodError);
  }
}

/**
 * This error class is thrown by the `validateQuery` middleware when the query parameters fail validation.
 * It extends the `MomijiValidationError` class and provides a specific error message indicating
 * that the query parameters are invalid.
 *
 * @example
 * import { Application } from "@oak/oak";
 * import { MomijiValidationError, MomijiInvalidQueryError } from "@momiji/validator";
 *
 * const app = new Application();
 *
 * app.use(async (ctx, next) => {
 *   try {
 *     await next();
 *   } catch (err) {
 *     if (err instanceof MomijiValidationError) {
 *       if (err instanceof MomijiInvalidQueryError) {
 *         // Handle invalid query parameters error
 *       }
 *     }
 *   }
 * });
 */
export class MomijiInvalidQueryError extends MomijiValidationError {
  /**
   * Creates an instance of MomijiInvalidQueryError.
   *
   * @param {ZodError} zodError - The Zod error object containing detailed validation errors related to the query parameters.
   */
  constructor(zodError: ZodError) {
    super("Invalid query parameters", zodError);
  }
}
