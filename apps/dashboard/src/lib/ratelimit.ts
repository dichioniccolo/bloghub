import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

export const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(30, "10 s"),
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "bloghub/dashboard",
});

export const ratelimitAi = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(50, "1 d"),
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "bloghub/ai",
});
