import type { Application } from "@oak/oak";
import {
  type SuperDeno,
  superoak,
} from "https://deno.land/x/superoak@4.8.1/mod.ts";

export const t_createApp =
  (app: Application): () => Promise<SuperDeno> => async () => {
    const appRequest = await superoak(app);

    return appRequest;
  };
