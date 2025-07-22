import { Queue } from "bullmq";
import { redisConnection } from "../redisClient";

export const cleaningQueue = new Queue("cleaning", {
  connection: redisConnection,
});
