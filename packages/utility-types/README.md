# Momiji Utility Types

This is a library containing useful utility types developed for
[Oak](https://github.com/oakserver/oak).

## `MergeStates`

This is a convenience type when typing multiple states in `ctx.state`.

If there are duplicate names, the type will be a string that will warn you about
them.

### Usage:

```ts
import { type Context, Router } from "@oak/oak";
import type { MergedStates } from "@momiji/utility-types";

type State1 = {
  p1: string;
};

type State2 = {
  p2: number;
};

type Merged = MergeStates<[State1, State2]>;
// Merged = State1 & State2

const router = new Router();

router.post("/endpoint", async (ctx: Context<Merged>) => {
  const { p1, p2 } = ctx.state;
});

// =========================================================
// Example with duplicate keys
type State3 = {
  p1: boolean;
};

type DuplicatedStateName = MergeStates<[State1, State3]>;
// DuplicatedStateName = "The state name *p1* is duplicated!"
```

You can also merge middleware types provided by this library.

```ts
import { Router } from "@oak/oak";
import type { MergeStates } from "@momiji/utility-types";
import { validateBody, validateQuery, type ValidatedBodyState, type ValidatedQueryState } from "@momiji/validator";

const bodyValidator = z.object({
  p1: z.string();
  p2: z.number();
});

type BodyValidator = z.infer<typeof bodyValidator>;

const queryValidator = z.object({
  p2: z.string(),
  p3: z.number()
}).partial();

type QueryValidator = z.infer<typeof queryValidator>;

const router = new Rotuer();

type States = MergeStates<[ValidatedBody<[BodyValidator]>, ValidatedQuery<[QueryValidator]>]>;

router.post(
  '/endpoint',
  async (ctx: Context<States>) => {
    const { validatedBody, validatedQuery }  = ctx.state;
    // validatedBody
    // { p1: string, p2: number }

    // validatedQuery
    // {p1?: string | undefined, p2?: number | undefined }
});
```

## Licence

MIT
