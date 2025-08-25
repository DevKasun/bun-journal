import db from "./client.ts";

export async function createNote(title: string, description: string) {
  const stmt = db.prepare(
    "INSERT INTO notes (title, description, created_at) VALUES (?, ?, ?)",
  );

  const result = stmt.run(title, description, new Date().toISOString());
  return { id: result.lastInsertRowid, title, description };
}

export function getAllNotes() {
  return db.query("SELECT * FROM notes ORDER BY created_at DESC").all();
}
