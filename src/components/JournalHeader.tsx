import { Search, User, Menu } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface JournalHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const JournalHeader = ({ searchQuery, onSearchChange }: JournalHeaderProps) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-4xl sm:text-5xl font-serif text-center mb-8 text-foreground">
        My Journal
      </h1>
      
      <div className="bg-card rounded-2xl shadow-medium p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">journal.com</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background border-border rounded-xl"
          />
        </div>
      </div>
    </header>
  );
};
