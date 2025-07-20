/* eslint-env node */

const config = {
  migrationFolder: "./migrations",
  direction: "up",
  databaseUrl: process.env.DATABASE_URL,
};

export default config;
