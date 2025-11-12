import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { JournalEntryData } from "./JournalEntry";

interface EntryDialogProps {
  entry: JournalEntryData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EntryDialog = ({ entry, open, onOpenChange }: EntryDialogProps) => {
  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-8">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <time className="text-sm text-muted-foreground font-medium">
              {entry.date}
            </time>
            {entry.subject && (
              <span className="inline-block text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                {entry.subject}
              </span>
            )}
          </div>
          <DialogTitle className="text-4xl sm:text-5xl font-serif text-foreground leading-tight">
            {entry.title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 pt-6 border-t border-border">
          {entry.images && entry.images.length > 0 && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {entry.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${entry.title} image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
          <div className="text-foreground/90 leading-relaxed text-base sm:text-lg whitespace-pre-wrap font-serif">
            {entry.content || entry.preview}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

