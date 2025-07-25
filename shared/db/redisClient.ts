import Redis from "ioredis";
import { logger } from "../helpers/logger";


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
