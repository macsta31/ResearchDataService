import { UpdateResearcher } from "../models/researcher";
import { UUID } from "../types/uuid";

export const createResearchersTable = `
CREATE TABLE IF NOT EXISTS researchers (
  id UUID PRIMARY KEY DEFAULT (gen_random_uuid()),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  lab_name TEXT NOT NULL,
  school_name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

export const buildCreateResearcherQuery = (
  first_name: string,
  last_name: string,
  email: string,
  lab_name: string,
  school_name: string
) => {
  const query = `
INSERT INTO researchers (first_name, last_name, email, lab_name, school_name, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
RETURNING id;`;
  const values = [first_name, last_name, email, lab_name, school_name];
  return { query, values };
};

export const buildGetResearcherByIdQuery = (id: string) => {
  const query = `SELECT * FROM researchers WHERE id = $1;`;
  const values = [id];
  return { query, values };
};

export const buildGetResearchers = (
  limit: number = 100,
  offset: number = 0
) => {
  const query = `SELECT * FROM researchers LIMIT $1 OFFSET $2;`;
  const values = [limit, offset];
  return { query, values };
};

export const buildUpdateResearcherQuery = (
  id: UUID,
  data: UpdateResearcher
) => {
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
UPDATE researchers
SET ${setClauses}, updated_at = $${updatedAtParamNumber}
WHERE id = $${idParamNumber}
RETURNING *;`;

  const values = [...entries.map(([, value]) => value), updated_at, id];

  return { query, values };
};
