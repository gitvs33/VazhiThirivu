import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  onCategorySelect: (category: string) => void;
  selectedCategory: string | null;
}

export const CategoryDialog = ({
  open,
  onOpenChange,
  categories,
  onCategorySelect,
  selectedCategory,
}: CategoryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Categories</DialogTitle>
          <DialogDescription>
            Select a category to filter your journal entries
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            className="justify-start"
            onClick={() => {
              onCategorySelect(null as any);
              onOpenChange(false);
            }}
          >
            <Folder className="mr-2 h-4 w-4" />
            All Entries
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="justify-start"
              onClick={() => {
                onCategorySelect(category);
                onOpenChange(false);
              }}
            >
              <Folder className="mr-2 h-4 w-4" />
              {category}
            </Button>
          ))}
        </div>
        {categories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No categories found</p>
            <p className="text-sm mt-2">
              Add folders in <code className="text-xs bg-muted px-2 py-1 rounded">public/subjects/</code>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
