import * as noteRepo from "../../db/notes.repo";

export async function GET(): Promise<Response> {
  const notes = noteRepo.getAllNotes();
  return new Response(JSON.stringify(notes), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(req: Request): Promise<Response> {
  const { title, description } = await req.json();
  if (!title) {
    return new Response(JSON.stringify({ error: "title is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const note = noteRepo.createNote(title, description);
  return new Response(JSON.stringify(note), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
