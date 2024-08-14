# Momiji - Query Parser Middleware

This is a middleware package for the [Oak](https://github.com/oakserver/oak) web
framework. It parses the query string from the request URL and stores the result
in the `ctx.state.parsedQuery`. This middleware is useful for extracting and
handling query parameters in an Oak application.

## Features

- Parses query parameters from the request URL.
- Automatically converts numbers and booleans by default.
- Customizable parsing options.
- Integrates seamlessly with Oak's middleware system.

## Installation

```bash
deno add @momiji/query-parser
```

## Usage

Here is a basic example of how to use the `queryParser` middleware in an Oak
application:

```ts
import { Application } from "@oak/oak";
import { type ParsedQueryState, queryParser } from "@momiji/query-parser";

const app = new Application();

app.use(queryParser());

app.get("/", (ctx: Context<ParsedQueryState>) => {
  const { parsedQuery } = ctx.state;
  console.log(parsedQuery);
});

fetch("/?param1=value&param2=1&param3=true");
// Console:
// { param1: 'value', param2: 1, param3: true  }
```

## Options

By default, the middleware converts numbers and booleans in the query string.
These options can be customized by passing a `ParseOptions` object to the
`queryParser` function.

```ts
import { ParseOptions, queryParser } from "@momiji/query-parser";

const customOptions: ParseOptions = {
  parseNumbers: false,
  parseBooleans: false,
};

app.use(queryParser(customOptions));
```

For more details on available options, refer to the
[query-string repository](https://github.com/sindresorhus/query-string).

## API Reference

### `queryParser(customOptions?: ParseOptions): Middleware`

- `customOptions` (optional): An object containing custom options for parsing
  the query string.
- Returns: A middleware function that parses the query string and stores it in
  `ctx.state.query`.

## License

MIT
