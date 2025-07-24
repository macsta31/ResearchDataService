import Redis from "ioredis";
import { logger } from "@mack/shared/helpers/logger";

logger.info(process.env.REDIS_HOST, process.env.REDIS_PORT);

export const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
});

redisConnection.on("connect", () => {
  logger.info("Connected to Redis");
});

redisConnection.on("error", (err) => {
  logger.error("Redis connection error:", err);
});
