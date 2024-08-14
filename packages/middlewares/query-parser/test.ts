import { assertEquals, type Context, testing } from "./deps.ts";
import { queryParser } from "./src/main.ts";
import type { ParsedQueryState } from "./src/types.ts";

const mockNext = testing.createMockNext();

Deno.test("Query parser test", async (t) => {
  await t.step("string param value", async () => {
    const ctx = testing.createMockContext({
      path: "/test?param=value",
    }) as unknown as Context<ParsedQueryState>;

    await queryParser()(ctx, mockNext);

    assertEquals(ctx.state.parsedQuery, {
      param: "value",
    });
  });

  await t.step(
    "if the parameter value can be converted to a number, it should be converted to a number",
    async () => {
      const ctx = testing.createMockContext({
        path: "/test?param=1",
      }) as unknown as Context<ParsedQueryState>;

      await queryParser()(ctx, mockNext);

      assertEquals(ctx.state.parsedQuery, {
        param: 1,
      });
    },
  );

  await t.step(
    "if the parameter value can be converted to a number, it should be converted to a number",
    async () => {
      const ctx = testing.createMockContext({
        path: "/test?param=true",
      }) as unknown as Context<ParsedQueryState>;

      await queryParser()(ctx, mockNext);

      assertEquals(ctx.state.parsedQuery, {
        param: true,
      });
    },
  );
});
