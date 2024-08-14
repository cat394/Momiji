# Momiji - CORS middleware

This is a middleware package for the [Oak](https://github.com/oakserver/oak) web
framework. This provides CORS (_Cross-Origin Resource Sharing_) middleware for
the [Oak](https://github.com/oakserver/oak) framework. This middleware sets the
appropriate CORS headers based on the provided options.

For more information about CORS, see
[MDN CORS page](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

## Installation

```bash
deno add @momiji/cors
```

## Usage

```ts
import { Application } from "@oak/oak";
import { cors, type CorsOptions } from "@momiji/cors";

const corsOptions: CorsOptions = {
  origin: "https://example.com",
  allowMethods: ["GET", "POST"],
  allowHeaders: ["Content-Type"],
  credentials: true,
  maxAge: 86400,
};

const app = new Application();

app.use(cors(corsOptions));
```

## Options

The `cors` middleware supports the following options. All of these are optional,
and if not provided, default values will be applied.

- `origin`: The allowed origin. Can be a `string`, `string[]`, or `function`.
  The default is `"*"` which allows all origins.
- `allowMethods`: The allowed HTTP methods. The default is
  `["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]`.
- `allowHeaders`: The allowed request headers. The default is
  `["Content-Type", "Authorization"]`.
- `exposeHeaders`: The response headers exposed to the client. The default is an
  empty array.
- `credentials`: Whether credentials are supported. The default is `false`.
- `maxAge`: The maximum period (in seconds) that the results of a preflight
  request can be cached. The default is `undefined`.

## Default Settings

If no specific options are provided, the following default settings will be
applied.

```ts
const defaultOptions: CorsOptions = {
  origin: "*",
  allowMethods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: [],
  credentials: false,
  maxAge: undefined,
};
```

## Advanced Usage

You can specify a function for `origin` to dynamically control the allowed
origin on a per-request basis.

```ts
const corsOptions: CorsOptions = {
  origin: (origin) => {
    return origin === "https://trusted.com";
  },
  allowMethods: ["GET"],
};
```

In this example, only requests from `https://trusted.com` are allowed.

## License

MIT
