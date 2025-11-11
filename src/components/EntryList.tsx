import { JournalEntry, JournalEntryData } from "./JournalEntry";

interface EntryListProps {
  entries: JournalEntryData[];
  onEntryClick: (entry: JournalEntryData) => void;
}

export const EntryList = ({ entries, onEntryClick }: EntryListProps) => {
  if (entries.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center py-12">
        <p className="text-muted-foreground text-lg">
          No entries yet. Click "New Entry" to start journaling.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-6 pb-12">
      {entries.map((entry) => (
        <JournalEntry
          key={entry.id}
          entry={entry}
          onClick={() => onEntryClick(entry)}
        />
      ))}
    </div>
  );
};
