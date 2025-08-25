import { Database } from "bun:sqlite";

let db: Database;
try {
  db = new Database("./journal.sqlite", { create: true });

  console.log("Database connected, attached DB files:");

  db.run("./schema.sql");
} catch (error) {
  console.error("Failed to create/connect to the database:", error);
  process.exit(1);
}

// db.close(false);

export default db;
