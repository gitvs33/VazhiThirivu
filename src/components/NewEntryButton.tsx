import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface NewEntryButtonProps {
  onClick: () => void;
}

export const NewEntryButton = ({ onClick }: NewEntryButtonProps) => {
  return (
    <div className="flex justify-end w-full max-w-4xl mx-auto px-4 sm:px-6 mb-6">
      <Button
        onClick={onClick}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-6 shadow-medium transition-all hover:shadow-lg"
      >
        <Plus className="h-5 w-5 mr-2" />
        <span>New Entry</span>
      </Button>
    </div>
  );
};
