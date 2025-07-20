import { db } from "../db";
import { CreateProject, Project } from "../models/project";

import {
  buildCreateProjectQuery,
  buildGetProjectByIdQuery,
} from "../queries/project";

interface ProjectController {
  create: (project: CreateProject) => Promise<Project>;
  getById: (id: string) => Promise<Project | null>;
}

export const projectController: ProjectController = {
  async create(projectData: CreateProject) {
    const { query, values } = buildCreateProjectQuery(
      projectData.name,
      projectData.description
    );
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      throw new Error("Failed to create project");
    }
    return result.rows[0] as Project;
  },

  async getById(id) {
    const { query, values } = buildGetProjectByIdQuery(id);
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0] as Project;
  },
};
