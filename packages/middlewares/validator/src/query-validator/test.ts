import {
  Application,
  type Context,
  queryParser,
  Router,
  Status,
  testing,
  z,
} from "../../deps.ts";
import type { ValidatedQueryState } from "./types.ts";
import { validateQuery } from "./main.ts";
import {
  t_createParamError,
  t_createParamTypeErrorMessage,
  t_zodErrorCatcher,
} from "../../testing-helpers/index.ts";

const TEST_ENDPOINT = "/query-test";

const app = new Application();

const validator = z
  .object({
    p1: z.string(),
    p2: z.number(),
    p3: z.boolean(),
  })
  .partial();

type IQueryValidator = z.infer<typeof validator>;

function setup() {
  app.use(queryParser());

  app.use(t_zodErrorCatcher());

  const router = new Router();

  router.get(
    TEST_ENDPOINT,
    validateQuery(validator),
    (ctx: Context<ValidatedQueryState<[IQueryValidator]>>) => {
      ctx.response.body = ctx.state.validatedQuery;
    },
  );

  app.use(router.routes());
  app.use(router.allowedMethods());
}

setup();

const createRequest = testing.createApp(app);

Deno.test("zodValidateQuery middleware test", async (t) => {
  await t.step("query is valid", async () => {
    const validSearchParams = "?p1=value&p2=123&p3=true";

    const expectedValidatedSearchParams: IQueryValidator = {
      p1: "value",
      p2: 123,
      p3: true,
    };

    const request = await createRequest();

    await request
      .get(TEST_ENDPOINT + validSearchParams)
      .expect(Status.OK)
      .expect(expectedValidatedSearchParams);
  });

  await t.step("query is invalid", async () => {
    const invalidSearchParams = "?p1=123&p2=false&p3=value3";

    const expectedErrorMessages = [
      t_createParamTypeErrorMessage({
        path: "p1",
        expected: "string",
        received: "number",
      }),
      t_createParamTypeErrorMessage({
        path: "p2",
        expected: "number",
        received: "boolean",
      }),
      t_createParamTypeErrorMessage({
        path: "p3",
        expected: "boolean",
        received: "string",
      }),
    ];

    const request = await createRequest();

    await request
      .get(TEST_ENDPOINT + invalidSearchParams)
      .expect(Status.BadRequest)
      .expect(t_createParamError(expectedErrorMessages));
  });

  await t.step("query should be optional", async () => {
    const expectedValidQueryState = {};

    const request = await createRequest();

    await request
      .get(TEST_ENDPOINT)
      .expect(Status.OK)
      .expect(expectedValidQueryState);
  });
});
