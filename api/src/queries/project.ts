import { UpdateProject } from "../models/project";
import { UUID } from "../types/uuid";

export const createProjectsTable = `
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT (gen_random_uuid()),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

export const buildCreateProjectQuery = (
  name: string,
  description: string,
  tags: string[] | [],
  researcher_id: string
) => {
  const query = `
INSERT INTO projects (name, description, researcher_id, tags, created_at, updated_at)
VALUES ($1, $2, $3, $4, NOW(), NOW())
RETURNING id;`;
  const values = [name, description, researcher_id, tags];
  return { query, values };
};

export const buildGetProjectByIdQuery = (id: string) => {
  const query = `SELECT * FROM projects WHERE id = $1;`;
  const values = [id];
  return { query, values };
};

export const buildGetProjects = (limit: number = 100, offset: number = 0) => {
  const query = `SELECT * FROM projects LIMIT $1 OFFSET $2;`;
  const values = [limit, offset];
  return { query, values };
};

export const buildGetProjectsByResearcherIdQuery = (
  researcher_id: string,
  limit: number = 100,
  offset: number = 0
) => {
  const query = `SELECT * FROM projects WHERE researcher_id = $1 LIMIT $2 OFFSET $3;`;
  const values = [researcher_id, limit, offset];
  return { query, values };
};

export const buildUpdateProjectQuery = (id: UUID, data: UpdateProject) => {
  const { updated_at, ...fields } = data;

  if (!id) {
    throw new Error("ID is required for updating a dataset");
  }

  if (!updated_at) {
    throw new Error("Updated at timestamp is required for updating a dataset");
  }

  const entries = Object.entries(fields);

  // Build SET clauses with correct parameter numbers
  const setClauses = entries
    .map(([key], index) => `${key} = $${index + 1}`)
    .join(", ");

  const updatedAtParamNumber = entries.length + 1;
  const idParamNumber = entries.length + 2;
  const query = `
UPDATE projects
SET ${setClauses}, updated_at = $${updatedAtParamNumber}
WHERE id = $${idParamNumber}
RETURNING *;`;

  const values = [...entries.map(([, value]) => value), updated_at, id];

  return { query, values };
};
