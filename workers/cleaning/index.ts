import { Worker } from "bullmq";
import { redisConnection } from "@mack/shared/db/redisClient";
import { logger } from "@mack/shared/helpers/logger";
import { CleaningJobData } from "@mack/shared/types/cleaning";

// Define the processor function
async function processCleaningJob(job: { data: CleaningJobData }) {
  const { visitId, dirty_file_url, cleaning_method } = job.data;

  logger.info(
    `Processing cleaning job for visit ${visitId} with method ${cleaning_method}`
  );

  try {
    // Your cleaning logic here
    // For example:
    // const cleanedData = await cleanData(dirty_file_url, cleaning_method);
    // await updateVisitWithCleanedData(visitId, cleanedData);

    logger.info(`Successfully cleaned visit ${visitId}`);
    return { success: true, visitId };
  } catch (error) {
    logger.error(`Failed to clean visit ${visitId}:`, error);
    throw error; // This will mark the job as failed
  }
}

// Create the worker
export const cleaningWorker = new Worker("cleaning", processCleaningJob, {
  connection: redisConnection,
  removeOnComplete: { count: 0 },
});

// Handle worker events
cleaningWorker.on("completed", (job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

cleaningWorker.on("failed", (job, err) => {
  logger.error(`Job ${job?.id} failed:`, err);
});

cleaningWorker.on("error", (err) => {
  logger.error("Worker error:", err);
});
