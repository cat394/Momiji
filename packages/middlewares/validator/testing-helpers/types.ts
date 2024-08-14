import type { ZodIssueCode } from "zod";

export type CreateParamErrorMessageArgs = {
  type?: ZodIssueCode;
  path: string;
  expected: string;
  received: string;
  message?: string;
};
