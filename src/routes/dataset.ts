import { Router, Request, Response } from "express";
import { DatasetController } from "../controllers/dataset";

const datasetsRouter = Router();

/**
 * Route to create a new dataset.
 * Expects a JSON body with the dataset details.
 * Returns the ID of the created dataset.
 * @param {CreateDataset} data - The dataset data to create.
 * @param {string} data.display_name - The display name of the dataset.
 * @param {string[]} data.tags - The tags associated with the dataset.
 * @param {string} data.project_id - The ID of the project the dataset belongs to.
 * @param {string} data.researcher_id - The ID of the researcher who created the dataset.
 * @return {Promise<string>} - The ID of the created dataset.
 * @throws {Error} - If the dataset creation fails.
 * @throws {Error} - If the request body is invalid.
 */
datasetsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const result = await DatasetController.create(req.body);
    res.status(201).json({ id: result });
  } catch (error) {
    console.error("Error creating dataset:", error);
    res
      .status(400)
      .json({ error: error.message, message: "Failed to create dataset" });
  }
});

/**
 * Route to get a dataset by ID.
 * Expects the dataset ID as a URL parameter.
 * Returns the dataset if found, otherwise returns a 404 error.
 * @param {string} id - The ID of the dataset to retrieve.
 * @return {Dataset | null} - The dataset if found, otherwise null.
 * This function retrieves a dataset by its ID from the database.
 * @throws {Error} - If the dataset retrieval fails.
 * @throws {Error} - If the dataset is not found.
 *
 */
datasetsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const dataset = await DatasetController.getById(req.params.id);
    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found" });
    }
    res.status(200).json(dataset);
  } catch (error) {
    console.error("Error retrieving dataset:", error);
    res
      .status(400)
      .json({ error: error.message, message: "Failed to retrieve dataset" });
  }
});

export default datasetsRouter;
