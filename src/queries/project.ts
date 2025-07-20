export const createProjectsTable = `
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT (gen_random_uuid()),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

export const buildCreateProjectQuery = (name: string, description: string) => {
  const query = `
INSERT INTO projects (name, description, created_at, updated_at)
VALUES ($1, $2, NOW(), NOW())
RETURNING id;`;
  const values = [name, description];
  return { query, values };
};

export const buildGetProjectByIdQuery = (id: string) => {
  const query = `SELECT * FROM projects WHERE id = $1;`;
  const values = [id];
  return { query, values };
};
