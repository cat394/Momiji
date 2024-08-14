# Momiji Validator Middleware

This is a middleware package for the [Oak](https://github.com/oakserver/oak) web
framework. This designed to make handling validation, error formatting, and
query parameter parsing easier and more efficient.

## Features

- **Body Validation** Middleware for validating request bodies using Zod
  schemas.
- **Query Parameter Validation** Middleware for validating query parameters.
- **Error Formatting** Utility function for formatting Zod errors into more
  readable messages.

## Installation

To use these middleware and utilities in your Oak application, install the
necessary dependencies:

```bash
deno add @momiji/validator
```

## Usage:

### `validateBody`

Validates request bodies using one or more Zod schemas. The validated data is
stored in `ctx.state.validatedBody`.

```ts
import { Context, Router } from "@oak/oak";
import { z } from "zod";
import { bodyValidator, type ValidatedBodyState } from "@momiji/validator";

const validator = z.object({
  p1: z.string(),
  p2: z.number(),
  p3: z.boolean(),
});

type BodyType = z.infer<typeof validator>;

const router = new Router();

router.post(
  "/endpoint",
  validateBody(bodyValidator),
  (ctx: Context<ValidatedBodyState<[BodyType]>>) => {
    const { p1, p2, p3 } = ctx.state.validatedBody;
    // p1 is string.
    // p2 is number.
    // p3 is boolean.
    // No need to do validation in your controllers! They can be used as a trusted source!
  },
);
```

### `validateQuery`

Validates query parameters using one or more Zod schemas. The validated data is
stored in `ctx.state.validatedQuery`.

```ts
import { Context, Router } from "@oak/oak";
import { z } from "zod";
import { zodValidateQuery } from "@momiji/validator";

const validatorA = z
  .object({
    p1: z.string(),
    p2: z.number(),
  })
  .partial();

const validatorB = z
  .object({
    p3: z.boolean(),
  })
  .partial();

type ValidatorA = z.infer<typeof validatorA>;

type ValidatorB = z.infer<typeof validatorB>;

router.post(
  "/endpoint",
  validateQuery(validatorA, validatorB),
  (ctx: Context<ValidatedQuery<[ValidatorA, ValidatorB]>>) => {
    const { p1, p2, p3 } = ctx.state.validatedQuery;
    // p1 is string | undefined
    // p2 is number | undefined
    // p3 is boolean | undefined
    // All query parameters are optional!
  },
);
```

## Utility Functions

### `formatZodError`

Formats a `ZodError` into a more readable array of error messages. This function
converts the default error format provided by Zod into a structured array of
objects, each containing the path of the error, a human-readable message, and
additional details.

```ts
import { z } from "zod";
import { formatZodError } from "@momiji/validator";

const validator = z.object({
  p1: z.string(),
  p2: z.number(),
});

const result = validator.safeParse({ p1: 123, p2: "invalid" });

if (!result.success) {
  const errorMessages = formatZodError(result.error);
  console.log(errorMessages);
  // Output:
  // [
  //   { path: 'p1', message: 'Expected string, received number', code: 'invalid_type', expected: 'string', received: 'number' },
  //   { path: 'p2', message: 'Expected number, received string', code: 'invalid_type', expected: 'number', received: 'string' }
  // ]
}
```

## Error Handling

If an error occurs during analysis of the body or query, the error will bubble
up globally. This allows you to centrally manage error handling. If the request
body is invalid, `MomijiInvalidBodyError` will be raised, and if the request
query parameter contains an invalid value, `MomijiInvalidQueryError` will be
raised. If you need to perform common processing in the body or query, check
whether it is an instance of the `MomijiValidationError` class, which these
error classes inherit.

```ts
import { Application, Status } from "@oak/oak";
import { MomijiValidationError, MomijiInvalidBodyError, MomijiInvalidQueryError, formatZodError } from "@momiji/validator";

const app = new Application();

const errorHandling: Middleware = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		if (err instanceof MomijiValidationError) {
			ctx.response.status = Status.BadRequest;

      if (err instanceof MomijiInvalidBodyError) {
        ctx.body.response = {
          message: 'Invalid body',
          details: {
            validationResult: formatZodError(err.zodError);
          }
        }
      }

      if (err instanceof MomijiInvalidQueryError) {
        ctx.body.response = {
          message: 'Invalid query parameter',
          details: {
            validationResult: formatZodError(err.zodError);
          }
        }
      }
		}
	}
}

app.use(errorHandling);
```

## License

MIT
