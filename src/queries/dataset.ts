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
