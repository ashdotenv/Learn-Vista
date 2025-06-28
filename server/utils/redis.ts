import Redis from "ioredis";
import { REDIS_URI } from "../config/config";

let redis: Redis | null = null;

export const connectToRedis = (): Redis => {
  if (!REDIS_URI) {
    throw new Error("REDIS_URI is not defined in the environment");
  }

  if (!redis) {
    redis = new Redis(REDIS_URI);

    redis.on("connect", () => {
      console.log("Redis connected");
    });

    redis.on("error", (err) => {
      console.error("❌ Redis connection error:", err);
    });
  }

  return redis;
};
