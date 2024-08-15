import type { ZodInvalidTypeIssue } from "../deps.ts";

function t_createZodInvalidTypeIssue({
  path,
  expected,
  received,
}: Omit<ZodInvalidTypeIssue, "message" | "code">): ZodInvalidTypeIssue {
  return {
    code: "invalid_type",
    path,
    message: `Expected ${expected}, received ${received}`,
    expected,
    received,
  };
}

export { t_createZodInvalidTypeIssue };
