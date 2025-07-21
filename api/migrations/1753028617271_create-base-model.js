/* eslint-env node, commonjs */

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  // Create researchers table
  pgm.createTable("researchers", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    first_name: { type: "text", notNull: true },
    last_name: { type: "text", notNull: true },
    email: { type: "text", notNull: true, unique: true },
    lab_name: { type: "text", notNull: true },
    school_name: { type: "text", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
  });

  // Create projects table
  pgm.createTable("projects", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: { type: "text", notNull: true },
    description: { type: "text", notNull: false },
    tags: { type: "text[]", notNull: true, default: pgm.func("ARRAY[]::text[]") },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
    researcher_id: {
      type: "uuid",
      notNull: true,
    },
  });

  // Add foreign key for projects
  pgm.addConstraint("projects", "projects_researcher_id_fkey", {
    foreignKeys: {
      columns: "researcher_id",
      references: "researchers(id)",
      onDelete: "CASCADE",
    },
  });

  // Create datasets table
  pgm.createTable("datasets", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    display_name: { type: "text", notNull: true },
    tags: { type: "text[]", notNull: true },
    project_id: { type: "uuid", notNull: true },
    researcher_id: { type: "uuid", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
  });

  // Add foreign keys for datasets
  pgm.addConstraint("datasets", "datasets_project_id_fkey", {
    foreignKeys: {
      columns: "project_id",
      references: "projects(id)",
      onDelete: "CASCADE",
    },
  });
  pgm.addConstraint("datasets", "datasets_researcher_id_fkey", {
    foreignKeys: {
      columns: "researcher_id",
      references: "researchers(id)",
      onDelete: "CASCADE",
    },
  });

  // Create visits table
  pgm.createTable("visits", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    researcher_id: { type: "uuid", notNull: true },
    visit_number: { type: "integer", notNull: true, default: 1 },
    notes: { type: "text", notNull: true, default: "''" },
    dataset_id: { type: "uuid", notNull: true },
    dirty_storage_url: { type: "text", notNull: false },
    cleaned_storage_url: { type: "text", notNull: false },
    approx_visit_timestamp: { type: "timestamp", notNull: false },
    participant_id: { type: "text", notNull: false },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
  });

  // Add foreign keys for visits
  pgm.addConstraint("visits", "visits_researcher_id_fkey", {
    foreignKeys: {
      columns: "researcher_id",
      references: "researchers(id)",
      onDelete: "CASCADE",
    },
  });
  pgm.addConstraint("visits", "visits_dataset_id_fkey", {
    foreignKeys: {
      columns: "dataset_id",
      references: "datasets(id)",
      onDelete: "CASCADE",
    },
  });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable("visits");
  pgm.dropTable("datasets");
  pgm.dropTable("researchers");
  pgm.dropTable("projects");
};
