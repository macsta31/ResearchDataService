import Redis from "ioredis";
import { logger } from "../helpers/logger";

export const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => {
  logger.info("Connected to redis");
});

redisConnection.on("error", (err) => {
  logger.error("Redis connection error:", err);
});
