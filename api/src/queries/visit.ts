import { UpdateVisit } from "../models/visit";
import { UUID } from "../types/uuid";

export const createVisitsTable = `
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT (gen_random_uuid()),
  researcher_id TEXT NOT NULL,
  visit_number INTEGER NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  dataset_id TEXT NOT NULL,
  dirty_storage_url TEXT,
  cleaned_storage_url TEXT,
  approx_visit_timestamp TIMESTAMP,
  participant_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (researcher_id) REFERENCES researchers(id),
  FOREIGN KEY (dataset_id) REFERENCES datasets(id),
);
`;

export const buildCreateVisitQuery = (
  researcherId: string,
  visitNumber: number,
  notes: string,
  datasetId: string,
  dirtyStorageUrl: URL | null,
  cleanedStorageUrl: URL | null,
  approxVisitTimestamp: Date | null,
  participantId: string | null
) => {
  const query = `
INSERT INTO visits (researcher_id, visit_number, notes, dataset_id, dirty_storage_url, cleaned_storage_url, approx_visit_timestamp, participant_id, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
RETURNING id;`;
  const values = [
    researcherId,
    visitNumber,
    notes,
    datasetId,
    dirtyStorageUrl,
    cleanedStorageUrl,
    approxVisitTimestamp,
    participantId,
  ];
  return { query, values };
};

export const buildGetVisitByIdQuery = (id: string) => {
  const query = `SELECT * FROM visits WHERE id = $1;`;
  const values = [id];
  return { query, values };
};

export const buildGetVisits = (limit: number = 100, offset: number = 0) => {
  const query = `SELECT * FROM visits LIMIT $1 OFFSET $2;`;
  const values = [limit, offset];
  return { query, values };
};

export const buildGetVisitsByResearcherIdQuery = (
  researcherId: string,
  limit: number = 100,
  offset: number = 0
) => {
  const query = `SELECT * FROM visits WHERE researcher_id = $1 LIMIT $2 OFFSET $3;`;
  const values = [researcherId, limit, offset];
  return { query, values };
};

export const buildUpdateVisitQuery = (id: UUID, data: UpdateVisit) => {
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
UPDATE visits
SET ${setClauses}, updated_at = $${updatedAtParamNumber}
WHERE id = $${idParamNumber}
RETURNING *;`;

  const values = [...entries.map(([, value]) => value), updated_at, id];

  return { query, values };
};
