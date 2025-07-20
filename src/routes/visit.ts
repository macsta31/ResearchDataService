import { Router } from "express";

import { visitController } from "../controllers/visit";

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

export default visitsRouter;