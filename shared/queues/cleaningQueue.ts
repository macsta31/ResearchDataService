import { Queue } from "bullmq";
import { redisConnection } from "../db/redisClient";

export const cleaningQueue = new Queue("cleaning", {
  connection: redisConnection,
});
