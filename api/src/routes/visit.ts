import { Router } from "express";

import { visitController } from "../controllers/visit";
import { logger } from "@mack/shared/helpers/logger";
import { cleaningQueue } from "@mack/shared/queues/cleaningQueue";
import { isValidCleaningMethod } from "@mack/shared/types/cleaning";

const visitsRouter = Router();

/**
 * Route to create a new visit.
 * Expects a JSON body with the visit details.
 * Returns the ID of the created visit.
 * @param {CreateVisit} data - The visit data to create.
 * @return {Promise<string>} - The ID of the created visit.
 * @throws {Error} - If the visit creation fails.
 */
visitsRouter.post("/", async (req, res) => {
  try {
    const result = await visitController.create(req.body);
    res.status(201).json({ id: result.id });
  } catch (error) {
    console.error("Error creating visit:", error);
    res
      .status(400)
      .json({ error: error.message, message: "Failed to create visit" });
  }
});

/**
 * Route to get a visit by ID.
 * Expects the visit ID as a URL parameter.
 * Returns the visit if found, otherwise returns a 404 error.
 * @param {string} id - The ID of the visit to retrieve.
 * @return {Visit | null} - The visit if found, otherwise null.
 * This function retrieves a visit by its ID from the database.
 * @throws {Error} - If the visit retrieval fails.
 * @throws {Error} - If the visit is not found.
 */
visitsRouter.get("/:id", async (req, res) => {
  try {
    const visit = await visitController.getById(req.params.id);
    if (!visit) {
      return res.status(404).json({ error: "Visit not found" });
    }
    res.status(200).json(visit);
  } catch (error) {
    console.error("Error retrieving visit:", error);
    res
      .status(400)
      .json({ error: error.message, message: "Failed to retrieve visit" });
  }
});

visitsRouter.get("/", async (req, res) => {
  try {
    const { researcherId } = req.query;
    if (researcherId) {
      const visits = await visitController.getByResearcherId(
        researcherId as string
      );
      return res.status(200).json(visits);
    } else {
      const visits = await visitController.get();
      res.status(200).json(visits);
    }
  } catch (error) {
    console.error("Error retrieving visits:", error);
    res
      .status(400)
      .json({ error: error.message, message: "Failed to retrieve visits" });
  }
});

visitsRouter.put("/:id", async (req, res) => {
  try {
    const updatedVisit = await visitController.update(req.params.id, req.body);
    res.status(200).json(updatedVisit);
  } catch (error) {
    console.error("Error updating visit:", error);
    res
      .status(400)
      .json({ error: error.message, message: "Failed to update visit" });
  }
});

visitsRouter.post("/:id/clean", async (req, res) => {
  try {
    const visitId = req.params.id;

    if (!visitId) {
      return res.status(400).json({ error: "Visit ID is required" });
    }

    if (!req.body || !req.body.cleaningMethod) {
      return res.status(400).json({ error: "Cleaning method is required" });
    }

    const { cleaningMethod } = req.body;

    logger.info("Cleaning method received:", cleaningMethod);

    if (!cleaningMethod || !isValidCleaningMethod(cleaningMethod)) {
      return res.status(400).json({ error: "Invalid cleaning method" });
    }

    logger.info(`Cleaning visit with ID: ${visitId}`);

    // Get the visit by ID to ensure it exists
    const visit = await visitController.getById(req.params.id);
    if (!visit) {
      return res.status(404).json({ error: "Visit not found" });
    }

    const queueElement = await cleaningQueue.add(
      `visit-clean-${req.params.id}`,
      {
        visitId: visit.id,
        dirty_file_url: visit.dirty_storage_url,
        cleaning_method: cleaningMethod,
      }
    );

    logger.info(
      `Added visit ${visitId} to cleaning queue with ID: ${queueElement.id}`
    );
    res
      .status(200)
      .json({ message: "Visit cleaning started", queueId: queueElement.id });
  } catch (error) {
    logger.error("Error cleaning visit:", error);
    res.status(500).json({
      error: error.message,
      message: "Failed to clean visit",
    });
  }
});

export default visitsRouter;
