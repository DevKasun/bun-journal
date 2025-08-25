import * as notesRepo from "../db/notes.repo";

export async function addNote(title: string, description: string) {
  if (!title) throw new Error("Title is required");
  return notesRepo.createNote(title, description);
}

export function listNotes() {
  return notesRepo.getAllNotes();
}
