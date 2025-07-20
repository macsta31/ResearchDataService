import { Router } from "express";

import { researcherController } from "../controllers/researcher";

const researchersRouter = Router();

/**
 * Route to create a new researcher.
 * Expects a JSON body with the researcher details.
 * Returns the ID of the created researcher.
 * @param {CreateResearcher} data - The researcher data to create.
 * @return {Promise<string>} - The ID of the created researcher.
 * @throws {Error} - If the researcher creation fails.
 */
researchersRouter.post("/", async (req, res) => {
  try {
    const result = await researcherController.create(req.body);
    res.status(201).json({ id: result.id });
  } catch (error) {
    console.error("Error creating researcher:", error);
    res
      .status(400)
      .json({ error: error.message, message: "Failed to create researcher" });
  }
});

/**
 * Route to get a researcher by ID.
 * Expects the researcher ID as a URL parameter.
 * Returns the researcher if found, otherwise returns a 404 error.
 * @param {string} id - The ID of the researcher to retrieve.
 * @return {Researcher | null} - The researcher if found, otherwise null.
 * This function retrieves a researcher by its ID from the database.
 * @throws {Error} - If the researcher retrieval fails.
 * @throws {Error} - If the researcher is not found.
 */
researchersRouter.get("/:id", async (req, res) => {
  try {
    const researcher = await researcherController.getById(req.params.id);
    if (!researcher) {
      return res.status(404).json({ error: "Researcher not found" });
    }
    res.status(200).json(researcher);
  } catch (error) {
    console.error("Error retrieving researcher:", error);
    res
      .status(400)
      .json({ error: error.message, message: "Failed to retrieve researcher" });
  }
});

export default researchersRouter;