import { Router } from "express";
import { projectController } from "../controllers/project";
import { logger } from "../helpers/logger";
const projectsRouter = Router();

/**
 * Route to create a new project.
 * Expects a JSON body with the project details.
 * Returns the ID of the created project.
 * @param {CreateProject} data - The project data to create.
 * @param {string} data.name - The name of the project.
 * @param {string[]} data.tags - The tags associated with the project.
 * @param {string} data.description - The description of the project.
 * @param {string} data.researcher_id - The ID of the researcher who created the project.
 * @return {Promise<string>} - The ID of the created project.
 * @throws {Error} - If the project creation fails.
 * @throws {Error} - If the request body is invalid.
 */
projectsRouter.post("/", async (req, res) => {
  try {
    logger.info("Creating project with data:", req.body);
    const result = await projectController.create(req.body);
    res.status(201).json({ id: result.id });
  } catch (error) {
    res.status(400).json({
      error: {
        code: error.code || "PROJECT_CREATION_FAILED",
        details: error.detail || "Failed to create project",
      },
      message: "Failed to create project",
    });
  }
});

/**
 * Route to get a project by ID.
 * Expects the project ID as a URL parameter.
 * Returns the project if found, otherwise returns a 404 error.
 * @param {string} id - The ID of the project to retrieve.
 * @return {Project | null} - The project if found, otherwise null.
 * This function retrieves a project by its ID from the database.
 * @throws {Error} - If the project retrieval fails.
 * @throws {Error} - If the project is not found.
 */
projectsRouter.get("/:id", async (req, res) => {
  try {
    const project = await projectController.getById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("Error retrieving project:", error);
    res
      .status(400)
      .json({ error: error.message, message: "Failed to retrieve project" });
  }
});

projectsRouter.get("/", async (req, res) => {
  try {
    const { researcherId } = req.query;
    if (researcherId) {
      const projects = await projectController.getByResearcherId(
        researcherId as string
      );
      return res.status(200).json(projects);
    }
    const projects = await projectController.get();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error retrieving projects:", error);
    res
      .status(400)
      .json({ error: error.message, message: "Failed to retrieve projects" });
  }
});

projectsRouter.put("/:id", async (req, res) => {
  try {
    const updatedProject = await projectController.update(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res
      .status(400)
      .json({ error: error.message, message: "Failed to update project" });
  }
});

export default projectsRouter;
