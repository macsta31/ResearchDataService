import { UpdateDataset } from "../models/dataset";
import { UUID } from "@mack/shared/types/uuid";

export const createDatasetsTable = `
CREATE TABLE IF NOT EXISTS datasets (
  id UUID PRIMARY KEY DEFAULT (gen_random_uuid()),
  display_name TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  project_id TEXT NOT NULL,
  researcher_id TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (researcher_id) REFERENCES researchers(id));`;

export const buildCreateDatasetQuery = (
  display_name: string,
  tags: Array<string>,
  project_id: string,
  researcher_id: string
) => {
  const query = `
INSERT INTO datasets (display_name, tags, project_id, researcher_id, created_at, updated_at)
VALUES ($1, $2, $3, $4, NOW(), NOW())
RETURNING id;`;

  const values = [display_name, tags, project_id, researcher_id];
  return { query, values };
};

export const buildGetDatasetByIdQuery = (id: string) => {
  const query = `
SELECT * FROM datasets WHERE id = $1;`;

  const values = [id];
  return { query, values };
};

export const buildGetDatasets = (limit: number = 100, offset: number = 0) => {
  const query = `
  SELECT * FROM datasets LIMIT $1 OFFSET $2;`;
  const values = [limit, offset];
  return { query, values };
};

export const buildGetDatasetsByResearcherIdQuery = (
  researcher_id: string,
  limit: number = 100,
  offset: number = 0
) => {
  const query = `
  SELECT * FROM datasets WHERE researcher_id = $1 LIMIT $2 OFFSET $3;`;
  const values = [researcher_id, limit, offset];
  return { query, values };
};

export const buildUpdateDatasetQuery = (id: UUID, data: UpdateDataset) => {
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
UPDATE datasets
SET ${setClauses}, updated_at = $${updatedAtParamNumber}
WHERE id = $${idParamNumber}
RETURNING *;`;

  const values = [...entries.map(([, value]) => value), updated_at, id];

  return { query, values };
};
