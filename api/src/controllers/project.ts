import { db } from "@mack/shared/db/db";
import { CreateProject, Project, UpdateProject } from "../models/project";

import {
  buildCreateProjectQuery,
  buildGetProjectByIdQuery,
  buildGetProjects,
  buildGetProjectsByResearcherIdQuery,
  buildUpdateProjectQuery,
} from "../queries/project";

interface ProjectController {
  create: (project: CreateProject) => Promise<Project>;
  getById: (id: string) => Promise<Project | null>;
  update: (id: string, data: UpdateProject) => Promise<Project>;
  get: () => Promise<Project[]>;
  getByResearcherId: (researcherId: string) => Promise<Project[]>;
}

export const projectController: ProjectController = {
  async create(projectData: CreateProject) {
    const { query, values } = buildCreateProjectQuery(
      projectData.name,
      projectData.description,
      projectData.tags || [],
      projectData.researcher_id
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
  async update(id, data) {
    const updated_at = new Date();
    const { query, values } = buildUpdateProjectQuery(id, {
      ...data,
      updated_at,
    } as UpdateProject);
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      throw new Error("Failed to update project");
    }
    return result.rows[0] as Project;
  },
  async get() {
    const { query, values } = buildGetProjects();
    const result = await db.query(query, values);
    return result.rows as Project[];
  },
  async getByResearcherId(researcherId) {
    const { query, values } = buildGetProjectsByResearcherIdQuery(researcherId);
    const result = await db.query(query, values);
    return result.rows as Project[];
  },
};
