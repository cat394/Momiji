import type { ZodError } from "../../deps.ts";
import { Symbols } from "../constants.ts";
import type {
  BaseInvalidErrorMessage,
  InvalidEnumValueErrorMessage,
  InvalidParamErrorMessage,
  InvalidTypeErrorMessage,
  TooBigErrorMessage,
  TooSmallErrorMessage,
} from "./types.ts";

const convertNumberOrBigintToString = (value: number | bigint): string => {
  let converted = value.toString();

  if (typeof value === "bigint") {
    converted = converted + "n";
  }

  return converted;
};

/**
 * Formats a ZodError into a more readable array of error messages.
 *
 * This function converts the default error format provided by Zod into a structured array of objects,
 * each containing the path of the error, a human-readable message, and additional details such as expected and received values.
 *
 * @note
 * For errors involving `minimum` and `maximum`, these values are converted to strings to handle cases where they may be `bigint`.
 * This ensures compatibility with JSON serialization, as `bigint` cannot be directly serialized to JSON.
 *
 * @param {ZodError} error - The ZodError instance returned from a failed Zod validation.
 * @returns {InvalidParamErrorMessage[]} - An array of formatted error messages.
 *
 * @example
 * const validator = z.object({
 *  p1: z.string(),
 *  p2: z.number(),
 *  p3: z.object({
 *    p4: z.string()
 *  })
 * });
 *
 * const invalidInput = { p1: 1, p2: 'invalid value' };
 *
 * const result = validator.safeParse(invalidInput);
 *
 * if (!result.success) {
 *   const errorMessages = formatZodError(result.error);
 *
 *   console.log(errorMessages);
 *   // Output:
 *   // [
 *   //   { path: 'p1', message: 'Expected string, received number', code: 'invalid_type', expected: 'string', received: 'number' },
 *   //   { path: 'p2', message: 'Expected number, received string', code: 'invalid_type', expected: 'number', received: 'string' },
 *   //   { path: 'p3', message: 'Required', code: 'invalid_type' }
 *   // ]
 * }
 *
 * @example
 * // Handling enum validation errors
 * const colorEnum = z.enum(['red', 'green', 'blue']);
 * const result = colorEnum.safeParse('yellow');
 *
 * if (!result.success) {
 *   const errorMessages = formatZodError(result.error);
 *
 *   console.log(errorMessages);
 *   // Output:
 *   // [
 *   //   { path: '', message: 'Invalid enum value. Expected one of: red,green, blue', code: 'invalid_enum_value', options: ['red', 'green', 'blue'] }
 *   // ]
 * }
 *
 * @example
 * // Handling number too large or too small errors
 * const numberSchema = z.number().min(10n).max(100n);
 * const result = numberSchema.safeParse(5n);
 *
 * if (!result.success) {
 *   const errorMessages = formatZodError(result.error);
 *
 *   console.log(errorMessages);
 *   // Output:
 *   // [
 *   //   { path: '', message: 'Value is too small. Minimum: 10n', code: 'too_small', minimum: '10n', inclusive: true }
 *   // ]
 * }
 */
export const formatZodError = (error: ZodError): InvalidParamErrorMessage[] => {
  return error.errors.map((err) => {
    switch (err.code) {
      case "invalid_type":
        return {
          code: "invalid_type",
          path: err.path.join(Symbols.ZOD_ERROR_PATH_DELIMITER),
          message: `Expected ${err.expected}, received ${err.received}`,
          expected: err.expected,
          received: err.received,
        } satisfies InvalidTypeErrorMessage;

      case "invalid_enum_value":
        return {
          code: "invalid_enum_value",
          path: err.path.join(Symbols.ZOD_ERROR_PATH_DELIMITER),
          message: `Invalid enum value. Expected one of: ${
            err.options.join(
              ", ",
            )
          }`,
          options: err.options,
        } satisfies InvalidEnumValueErrorMessage;

      case "too_small": {
        const stringifiedMinimum = convertNumberOrBigintToString(err.minimum);

        return {
          code: "too_small",
          path: err.path.join(Symbols.ZOD_ERROR_PATH_DELIMITER),
          message: `Value is too small. Minimum: ${stringifiedMinimum}`,
          minimum: stringifiedMinimum,
          inclusive: err.inclusive,
        } satisfies TooSmallErrorMessage;
      }

      case "too_big": {
        const stringifiedMaximum = convertNumberOrBigintToString(err.maximum);

        return {
          code: "too_big",
          path: err.path.join(Symbols.ZOD_ERROR_PATH_DELIMITER),
          message: `Value is too large. Maximum: ${stringifiedMaximum}`,
          maximum: stringifiedMaximum,
          inclusive: err.inclusive,
        } satisfies TooBigErrorMessage;
      }

      default:
        return {
          code: err.code,
          path: err.path.join(Symbols.ZOD_ERROR_PATH_DELIMITER),
          message: err.message,
        } satisfies BaseInvalidErrorMessage;
    }
  });
};
