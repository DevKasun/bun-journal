import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

type JournalEntry = {
  id: string;
  title: string;
  date: string; // ISO string
  tags: string[];
  content: string;
};

const initialEntries: JournalEntry[] = [
  {
    id: "1",
    title: "Morning reflections",
    date: "2025-09-01T08:12:00.000Z",
    tags: ["morning", "gratitude"],
    content:
      "Grateful for a calm start. Focus today: deep work, short walks, and less coffee.",
  },
  {
    id: "2",
    title: "Ideas for side project",
    date: "2025-09-03T20:30:00.000Z",
    tags: ["ideas", "tech"],
    content:
      "Thinking about a tiny notes app with hotkeys, offline sync, and AI summaries.",
  },
];

function App() {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialEntries[0]?.id ?? null,
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => {
      return (
        e.title.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        e.tags.join(" ").toLowerCase().includes(q)
      );
    });
  }, [entries, query]);

  const selected = entries.find((e) => e.id === selectedId) ?? null;

  function handleNew() {
    const now = new Date();
    const id = crypto.randomUUID();
    const newEntry: JournalEntry = {
      id,
      title: "Untitled entry",
      date: now.toISOString(),
      tags: [],
      content: "",
    };
    setEntries((prev) => [newEntry, ...prev]);
    setSelectedId(id);
  }

  function updateSelected<K extends keyof JournalEntry>(
    key: K,
    value: JournalEntry[K],
  ) {
    if (!selected) return;
    setEntries((prev) =>
      prev.map((e) => (e.id === selected.id ? { ...e, [key]: value } : e)),
    );
  }

  function deleteSelected() {
    if (!selected) return;
    setEntries((prev) => prev.filter((e) => e.id !== selected.id));
    setSelectedId((prevId) => {
      if (prevId !== selected.id) return prevId;
      return entries.find((e) => e.id !== selected.id)?.id ?? null;
    });
  }

  return (
    <div className="h-screen w-screen bg-neutral-50 text-neutral-900">
      <header className="flex items-center justify-between border-b bg-white px-4 py-3">
        <h1 className="text-lg font-semibold">Journal</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNew}
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 active:bg-neutral-700"
          >
            + New Entry
          </button>
          {selected && (
            <button
              onClick={deleteSelected}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Delete
            </button>
          )}
        </div>
      </header>

      <main className="grid h-[calc(100vh-56px)] grid-cols-1 md:grid-cols-[320px_1fr]">
        {/* Sidebar */}
        <aside className="border-r bg-white">
          <div className="p-3">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search entries..."
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">
                ⌘K
              </span>
            </div>
          </div>
          <div className="h-[1px] bg-neutral-100" />
          <ul className="overflow-auto p-2 space-y-1 h-[calc(100%-64px)]">
            {filtered.length === 0 && (
              <li className="px-3 py-10 text-center text-sm text-neutral-500">
                No entries found.
              </li>
            )}
            {filtered.map((e) => {
              const isActive = e.id === selectedId;
              const date = new Date(e.date);
              return (
                <li key={e.id}>
                  <button
                    onClick={() => setSelectedId(e.id)}
                    className={`w-full rounded-md px-3 py-2 text-left hover:bg-neutral-100 ${
                      isActive ? "bg-neutral-100" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate font-medium">{e.title}</span>
                      <span className="ml-2 shrink-0 text-xs text-neutral-500">
                        {date.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                      {e.content || "No content yet..."}
                    </p>
                    {e.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {e.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Editor panel */}
        <section className="flex flex-col">
          {selected ? (
            <div className="h-full overflow-auto p-4 md:p-6">
              <div className="mx-auto max-w-3xl space-y-4">
                <input
                  value={selected.title}
                  onChange={(e) => updateSelected("title", e.target.value)}
                  placeholder="Entry title"
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xl font-semibold outline-none focus:border-neutral-500"
                />

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="date"
                    value={toDateInput(selected.date)}
                    onChange={(e) =>
                      updateSelected(
                        "date",
                        new Date(e.target.value).toISOString(),
                      )
                    }
                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 sm:w-auto"
                  />
                  <TagsEditor
                    tags={selected.tags}
                    onChange={(tags) => updateSelected("tags", tags)}
                  />
                </div>

                <textarea
                  value={selected.content}
                  onChange={(e) => updateSelected("content", e.target.value)}
                  placeholder="Write your thoughts..."
                  className="min-h-[50vh] w-full resize-y rounded-md border border-neutral-300 bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-neutral-500"
                />
              </div>
            </div>
          ) : (
            <EmptyState onNew={handleNew} />
          )}
        </section>
      </main>
    </div>
  );
}

function TagsEditor({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [value, setValue] = useState("");

  function addTag(tag: string) {
    const t = tag.trim();
    if (!t) return;
    if (tags.includes(t)) return;
    onChange([...tags, t]);
  }

  function removeTag(tag: string) {
    onChange(tags.filter((x) => x !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(value);
      setValue("");
    } else if (e.key === "Backspace" && value === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700"
          >
            #{t}
            <button
              onClick={() => removeTag(t)}
              className="text-neutral-500 hover:text-neutral-700"
              aria-label={`Remove tag ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tag and press Enter"
        className="min-w-[180px] rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-neutral-500"
      />
    </div>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mx-auto max-w-sm space-y-3 p-6">
        <div className="text-5xl">📓</div>
        <h2 className="text-xl font-semibold">Your journal awaits</h2>
        <p className="text-sm text-neutral-600">
          Create your first entry and start capturing your thoughts.
        </p>
        <button
          onClick={onNew}
          className="mt-2 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 active:bg-neutral-700"
        >
          + New Entry
        </button>
      </div>
    </div>
  );
}

function toDateInput(iso: string) {
  // Convert ISO to YYYY-MM-DD for input[type="date"]
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
