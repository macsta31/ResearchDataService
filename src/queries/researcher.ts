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
