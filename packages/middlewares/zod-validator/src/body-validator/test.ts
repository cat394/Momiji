import {
  Application,
  type Context,
  createApp,
  Router,
  Status,
  z,
} from "../../deps.ts";
import type { ValidatedBodyState } from "./types.ts";
import { validateBody } from "./main.ts";
import {
  t_createParamError,
  t_createParamTypeErrorMessage,
  t_zodErrorCatcher,
} from "../../testing-helpers/index.ts";
import type { InvalidTypeErrorMessage } from "../format-zod-error/types.ts";

enum TEST_ENDPOINT {
  SINGLE_CASE = "/validator-single",
  MULTIPLE_CASE = "/validator-multiple",
}

const app = new Application();

const validatorA = z.object({
  p1: z.string(),
  p2: z.number(),
});

const validatorB = z.object({
  p3: z.boolean(),
});

type AType = z.infer<typeof validatorA>;
type BType = z.infer<typeof validatorB>;

type ValidBodyStateSingle = ValidatedBodyState<[AType]>;
type ValidBodyStateMultiple = ValidatedBodyState<[AType, BType]>;

function setup() {
  app.use(t_zodErrorCatcher());

  const router = new Router();

  router.post(
    TEST_ENDPOINT.SINGLE_CASE,
    validateBody(validatorA),
    (ctx: Context<ValidBodyStateSingle>) => {
      ctx.response.status = Status.OK;
      ctx.response.body = ctx.state.validatedBody;
    },
  );

  router.post(
    TEST_ENDPOINT.MULTIPLE_CASE,
    validateBody(validatorA, validatorB),
    (ctx: Context<ValidBodyStateMultiple>) => {
      ctx.response.status = Status.OK;
      ctx.response.body = ctx.state.validatedBody;
    },
  );

  app.use(router.routes());
  app.use(router.allowedMethods());
}

setup();

const createRequest = createApp(app);

Deno.test("zodValidateBody middleware test", async (t) => {
  await t.step("body is valid", async () => {
    const validBody: AType = {
      p1: "value",
      p2: 123,
    };

    const request = await createRequest();

    await request
      .post(TEST_ENDPOINT.SINGLE_CASE)
      .send(JSON.stringify(validBody))
      .expect(Status.OK)
      .expect(validBody);
  });

  await t.step("body is invalid", async () => {
    const invalidBody = {
      p1: 123,
      p2: false,
    };

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
    ];

    const request = await createRequest();

    await request
      .post(TEST_ENDPOINT.SINGLE_CASE)
      .send(JSON.stringify(invalidBody))
      .expect(Status.BadRequest)
      .expect(t_createParamError(expectedErrorMessages));
  });

  await t.step("multiple validators, body is valid", async () => {
    const validBody = {
      p1: "value",
      p2: 123,
      p3: true,
    };

    const request = await createRequest();

    await request
      .post(TEST_ENDPOINT.MULTIPLE_CASE)
      .send(JSON.stringify(validBody))
      .expect(Status.OK)
      .expect(validBody);
  });

  await t.step("multiple validators, body is invalid", async () => {
    const invalidBody = {
      p1: 123,
      p2: false,
      p3: "value",
    };

    const expectedErrorMessages: InvalidTypeErrorMessage[] = [
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
      .post(TEST_ENDPOINT.MULTIPLE_CASE)
      .send(JSON.stringify(invalidBody))
      .expect(Status.BadRequest)
      .expect(t_createParamError(expectedErrorMessages));
  });
});
