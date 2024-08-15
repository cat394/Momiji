import { Application, assertEquals } from "./deps.ts";
import { cors } from "./src/main.ts";
import type { CorsOptions } from "./src/types.ts";
import { t_createApp } from "./testing-tools/index.ts";

const TEST_ENDPOINT = "/";
const TEST_ORIGIN = "https://example.com";
const ANOTHER_ORIGIN = "https://another.com";
const NOT_ALLOWED_ORIGIN = "https://not-allowed.com";

const TEST_CORS_OPTIONS = {
  ORIGIN_STRING: { origin: TEST_ORIGIN },
  ORIGIN_ARRAY: { origin: [TEST_ORIGIN, ANOTHER_ORIGIN] },
  ORIGIN_FUNCTION: {
    origin: (requestOrigin: string) => requestOrigin === TEST_ORIGIN,
  },
  DEFAULT_ORIGIN: {},
  EXPOSE_HEADERS: {
    origin: TEST_ORIGIN,
    exposeHeaders: ["X-Custom-Header"],
  },
  ALLOW_METHODS: {
    origin: TEST_ORIGIN,
    allowMethods: ["GET", "POST"],
  },
  SETTED_MAX_AGE: {
    origin: TEST_ORIGIN,
    maxAge: 600,
  },
} satisfies Record<string, CorsOptions>;

type CreateTestAppArgs = {
  case: keyof typeof TEST_CORS_OPTIONS;
};

function createTestApp({ case: caseName }: CreateTestAppArgs) {
  const app = new Application();
  app.use(cors(TEST_CORS_OPTIONS[caseName]));
  const createRequestFunction = t_createApp(app);
  return createRequestFunction;
}

Deno.test("CORS Middleware Invalid Cases", async (t) => {
  await t.step(
    "should not set Access-Control-Allow-Credentials when origin is wildcard",
    async () => {
      const createRequest = createTestApp({ case: "DEFAULT_ORIGIN" });

      const request = await createRequest();

      const response = await request
        .get(TEST_ENDPOINT)
        .set("Origin", TEST_ORIGIN);

      assertEquals(
        response.headers["access-control-allow-credentials"],
        undefined,
      );
    },
  );

  await t.step(
    "should not set Access-Control-Allow-Origin if Origin header is missing",
    async () => {
      const createRequest = createTestApp({ case: "DEFAULT_ORIGIN" });

      const request = await createRequest();

      const response = await request.get(TEST_ENDPOINT);

      assertEquals(response.headers["access-control-allow-origin"], undefined);
    },
  );

  await t.step(
    "should not set Access-Control-Allow-Origin for invalid function result",
    async () => {
      const createRequest = createTestApp({ case: "ORIGIN_FUNCTION" });

      const request = await createRequest();

      const response = await request
        .get(TEST_ENDPOINT)
        .set("Origin", NOT_ALLOWED_ORIGIN);

      assertEquals(response.headers["access-control-allow-origin"], undefined);
    },
  );

  await t.step(
    "should set Access-Control-Max-Age when maxAge option is provided",
    async () => {
      const createRequest = createTestApp({ case: "SETTED_MAX_AGE" });

      const request = await createRequest();

      const response = await request
        .options(TEST_ENDPOINT)
        .set("Origin", TEST_ORIGIN);

      assertEquals(response.headers["access-control-max-age"], "600");
    },
  );

  await t.step(
    "should not set Vary header when origin is wildcard",
    async () => {
      const createRequest = createTestApp({ case: "DEFAULT_ORIGIN" });

      const request = await createRequest();

      const response = await request
        .get(TEST_ENDPOINT)
        .set("Origin", TEST_ORIGIN);

      assertEquals(response.headers["vary"], undefined);
    },
  );

  await t.step(
    "should not set preflight headers on non-OPTIONS requests",
    async () => {
      const createRequest = createTestApp({ case: "ALLOW_METHODS" });

      const request = await createRequest();

      const response = await request
        .get(TEST_ENDPOINT)
        .set("Origin", TEST_ORIGIN);

      assertEquals(response.headers["access-control-allow-methods"], undefined);
    },
  );
});

Deno.test("CORS Middleware", async (t) => {
  await t.step("origin test", async (t) => {
    await t.step(
      "should allow requests from a specific origin when origin is a string",
      async () => {
        const createRequest = createTestApp({ case: "ORIGIN_STRING" });

        const request = await createRequest();

        const response = await request
          .get(TEST_ENDPOINT)
          .set("Origin", TEST_ORIGIN);

        assertEquals(
          response.headers["access-control-allow-origin"],
          TEST_ORIGIN,
        );
      },
    );

    await t.step(
      "should block requests from other origins when origin is a string",
      async () => {
        const createRequest = createTestApp({ case: "ORIGIN_STRING" });

        const request = await createRequest();

        const response = await request
          .get(TEST_ENDPOINT)
          .set("Origin", ANOTHER_ORIGIN);

        assertEquals(
          response.headers["access-control-allow-origin"],
          undefined,
        );
      },
    );

    await t.step(
      "should allow requests from an origin in the allowed list when origin is a string array",
      async () => {
        const createRequest = createTestApp({ case: "ORIGIN_ARRAY" });

        const request = await createRequest();

        const response = await request
          .get(TEST_ENDPOINT)
          .set("Origin", ANOTHER_ORIGIN);

        assertEquals(
          response.headers["access-control-allow-origin"],
          ANOTHER_ORIGIN,
        );
      },
    );

    await t.step(
      "should block requests from origins not in the allowed list when origin is a string array",
      async () => {
        const createRequest = createTestApp({ case: "ORIGIN_ARRAY" });

        const request = await createRequest();

        const response = await request
          .get(TEST_ENDPOINT)
          .set("Origin", NOT_ALLOWED_ORIGIN);

        assertEquals(
          response.headers["access-control-allow-origin"],
          undefined,
        );
      },
    );
  });

  await t.step(
    "should set Access-Control-Allow-Origin for allowed origins",
    async () => {
      const createRequest = createTestApp({ case: "ORIGIN_FUNCTION" });

      const request = await createRequest();

      const response = await request
        .get(TEST_ENDPOINT)
        .set("Origin", TEST_ORIGIN);

      assertEquals(
        response.headers["access-control-allow-origin"],
        TEST_ORIGIN,
      );
    },
  );

  await t.step(
    "should set default Access-Control-Allow-Origin for other origins",
    async () => {
      const createRequest = createTestApp({ case: "DEFAULT_ORIGIN" });

      const request = await createRequest();

      const response = await request
        .get(TEST_ENDPOINT)
        .set("Origin", ANOTHER_ORIGIN);

      assertEquals(response.headers["access-control-allow-origin"], "*");
    },
  );

  await t.step("should set Access-Control-Expose-Headers", async () => {
    const createRequest = createTestApp({ case: "EXPOSE_HEADERS" });

    const request = await createRequest();

    const response = await request
      .get(TEST_ENDPOINT)
      .set("Origin", TEST_ORIGIN);

    assertEquals(
      response.headers["access-control-expose-headers"],
      "X-Custom-Header",
    );
  });

  await t.step(
    "should respond to preflight requests with correct headers",
    async () => {
      const createRequest = createTestApp({ case: "ALLOW_METHODS" });

      const request = await createRequest();

      const response = await request
        .options(TEST_ENDPOINT)
        .set("Origin", TEST_ORIGIN)
        .set("Access-Control-Request-Method", "POST");

      assertEquals(response.statusCode, 204);
      assertEquals(
        response.headers["access-control-allow-methods"],
        "GET,POST",
      );
    },
  );

  await t.step("should set Vary header for specific origins", async () => {
    const createRequest = createTestApp({ case: "ORIGIN_FUNCTION" });

    const request = await createRequest();

    const response = await request
      .get(TEST_ENDPOINT)
      .set("Origin", TEST_ORIGIN);

    assertEquals(response.headers["vary"], "Origin");
  });
});
