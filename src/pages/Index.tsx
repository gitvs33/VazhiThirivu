import { useState, useEffect, useMemo } from "react";
import { JournalHeader } from "@/components/JournalHeader";
import { EntryList } from "@/components/EntryList";
import { CategoryDialog } from "@/components/CategoryDialog";
import { JournalEntryData } from "@/components/JournalEntry";
import { loadEntriesFromPublic, searchEntries } from "@/utils/journalLoader";
import { useToast } from "@/hooks/use-toast";
import journalBg from "@/assets/journal-bg.jpg";

const Index = () => {
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntryData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const { toast } = useToast();

  // Extract unique categories (folder names) from entries
  const categories = useMemo(() => {
    return [...new Set(entries.map(entry => entry.subject))].filter(Boolean).sort();
  }, [entries]);

  useEffect(() => {
    loadEntriesFromPublic().then((loadedEntries) => {
      setEntries(loadedEntries);
      setFilteredEntries(loadedEntries);
    });
  }, []);

  useEffect(() => {
    let results = searchEntries(entries, searchQuery);
    
    // Apply category filter
    if (selectedCategory) {
      results = results.filter(entry => entry.subject === selectedCategory);
    }
    
    setFilteredEntries(results);
  }, [searchQuery, entries, selectedCategory]);

  const handleCategoryClick = () => {
    setCategoryDialogOpen(true);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleEntryClick = (entry: JournalEntryData) => {
    toast({
      title: entry.title,
      description: entry.content || entry.preview,
    });
  };

  return (
    <div 
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: `url(${journalBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="min-h-screen backdrop-blur-[1px]">
        <JournalHeader 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          onCategoryClick={handleCategoryClick}
        />
        <EntryList entries={filteredEntries} onEntryClick={handleEntryClick} />
        
        <CategoryDialog
          open={categoryDialogOpen}
          onOpenChange={setCategoryDialogOpen}
          categories={categories}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
};

export default Index;
