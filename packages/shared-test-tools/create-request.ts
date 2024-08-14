import type { Application } from "@oak/oak";
import { type SuperDeno, superoak } from "superoak";

export const createApp =
  (app: Application): () => Promise<SuperDeno> => async () => {
    const appRequest = await superoak(app);

    return appRequest;
  };
