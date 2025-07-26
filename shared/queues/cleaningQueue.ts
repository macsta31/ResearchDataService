import { Job, Queue } from "bullmq";
import { redisConnection } from "../db/redisClient";
import { CleaningJobData } from "../types/cleaning";
import { logger } from "../helpers/logger";

export const cleaningQueue = new Queue("cleaning", {
  connection: redisConnection,
});

export const getCleaningJob = async (jobId: string): Promise<Job> => {
  try {
    const job = await cleaningQueue.getJob(jobId);
    if (job) {
      return job;
    } else {
      logger.error(`No job found for jobId: ${jobId}`);
      throw new Error("No job found");
    }
  } catch (err) {
    logger.error("Error getting cleaning job", err);
    throw err;
  }
};

export const addCleaningJob = async (
  jobName: string,
  jobData: CleaningJobData
): Promise<Job> => {
  try {
    const job = await cleaningQueue.add(jobName, jobData, {
      jobId: jobName,
    });
    logger.info(`Added cleaning job ${job.id} to the queue`);
    return job;
  } catch (error) {
    logger.error("Error adding cleaning job to the queue:", error);
    throw error;
  }
};

/**
 * Remove job from cleaning queue.
 * @throws {Error} - If failed to remove job from queue
 */
export const removeCleaningJob = async (jobId: string): Promise<Boolean> => {
  try {
    const job = cleaningQueue.getJob(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const removeJobResponse = await cleaningQueue.remove(jobId, {
      removeChildren: true,
    });
    if (removeJobResponse === 1) {
      return true;
    } else if (removeJobResponse === 0) {
      throw new Error("Job or child are locked");
    } else {
      throw new Error("Removal did not return 1 or 0");
    }
  } catch (err) {
    logger.error("Failed to remove job from cleaning queue", err);
    throw err;
  }
};
