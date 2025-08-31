export interface Note {
    id: number;
    title: string;
    description: string;
    createdAt: string;
}

export interface CreateNote {
    title: string;
    description: string;
}

export interface CreateNoteResponse extends Note { }
export interface ListNotesResponse extends Array<Note> { }

export interface UpdateNote {
    title: string;
    description: string;
}