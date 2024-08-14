import type { CreateParamErrorMessageArgs } from "./types.ts";
import type {
  InvalidParamErrorMessage,
  InvalidTypeErrorMessage,
} from "../src/format-zod-error/types.ts";

function t_createParamTypeErrorMessage({
  path,
  expected,
  received,
}: CreateParamErrorMessageArgs): InvalidTypeErrorMessage {
  return {
    code: "invalid_type",
    path,
    message: `Expected ${expected}, received ${received}`,
    expected,
    received,
  };
}

function t_createParamError(details: InvalidParamErrorMessage[]) {
  return {
    message: "Invalid parameter error",
    details,
  };
}

export { t_createParamError, t_createParamTypeErrorMessage };
