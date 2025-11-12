import { Card } from "./ui/card";

export interface JournalEntryData {
  id: string;
  date: string;
  title: string;
  preview: string;
  subject: string;
  content?: string;
  images?: string[];
}

interface JournalEntryProps {
  entry: JournalEntryData;
  onClick: () => void;
}

export const JournalEntry = ({ entry, onClick }: JournalEntryProps) => {
  return (
    <Card
      onClick={onClick}
      className="bg-card hover:shadow-medium transition-all cursor-pointer p-6 rounded-2xl border border-border"
    >
      <time className="text-sm text-muted-foreground block mb-2">
        {entry.date}
      </time>

      <h2 className="text-2xl font-serif text-foreground mb-3">
        {entry.title}
      </h2>

      {entry.images && entry.images.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {entry.images.slice(0, 4).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${entry.title} image ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      <p className="text-foreground/80 leading-relaxed line-clamp-3">
        {entry.preview}
      </p>

      {entry.subject && (
        <div className="mt-4">
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
            {entry.subject}
          </span>
        </div>
      )}
    </Card>
  );
};
