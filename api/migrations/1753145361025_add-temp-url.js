/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.addColumn("visits", {
    temp_storage_url: {
      type: "text",
      notNull: false, // Optional, depends if you want to enforce it
      default: null, // Default value if needed
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("visits", "temp_storage_url");
};
