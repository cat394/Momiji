import type { ZodIssue, ZodIssueCode } from "../../deps.ts";

export type BaseInvalidErrorMessage = {
  code: ZodIssueCode;
  path: string;
  message: ZodIssue["message"];
};

export type InvalidTypeErrorMessage = BaseInvalidErrorMessage & {
  code: Extract<ZodIssueCode, "invalid_type">;
  expected: string;
  received: string;
};

export type InvalidEnumValueErrorMessage = BaseInvalidErrorMessage & {
  code: Extract<ZodIssueCode, "invalid_enum_value">;
  options: (string | number)[];
};

export type TooSmallErrorMessage = BaseInvalidErrorMessage & {
  code: Extract<ZodIssueCode, "too_small">;
  minimum: string;
  inclusive: boolean;
};

export type TooBigErrorMessage = BaseInvalidErrorMessage & {
  code: Extract<ZodIssueCode, "too_big">;
  maximum: string;
  inclusive: boolean;
};

export type InvalidParamErrorMessage =
  | BaseInvalidErrorMessage
  | InvalidTypeErrorMessage
  | InvalidEnumValueErrorMessage
  | TooSmallErrorMessage
  | TooBigErrorMessage;
