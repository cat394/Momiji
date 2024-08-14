/**
 * These are symbols with special meanings used in this modules.
 */
export enum Symbols {
  /**
   *  This is the delimiter used to represent the path when the zod schema is a nested object.
   *
   *  @example
   *  import { z } from "zod";
   *  import { formatZodError } from "@momiji/validator";
   *
   *  const schema = z.object({
   *    p1: z.string(),
   *    p2: z.object({
   *      p3: z.string()
   *    })
   *  });
   *
   *  const invalidInput = { p1: 'valid', p2: { p3: 1 }};
   *
   *  const result = schema.safeParse(invaidInput);
   *
   *  if (!result.success) {
   *    const formatted = formatZodError(result.error);
   *
   *    console.log(formatted);
   *    // Output: [
   *     {
   *       code: "invalid_type",
   *       path: "p2.p3",
   *       message: "Expected string, received number",
   *       expected: "string",
   *       received: "number",
   *      },
   *    ]
   *  }
   */
  ZOD_ERROR_PATH_DELIMITER = ".",
}

/**
 * These are custom state names used in this modules.
 */
export enum CustomStateNames {
  VALIDATED_QUERY = "validatedQuery",
  VALIDATED_BODY = "validatedBody",
}
