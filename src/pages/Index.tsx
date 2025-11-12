import { useState, useEffect, useMemo } from "react";
import { JournalHeader } from "@/components/JournalHeader";
import { EntryList } from "@/components/EntryList";
import { CategoryDialog } from "@/components/CategoryDialog";
import { EntryDialog } from "@/components/EntryDialog";
import { JournalEntryData } from "@/components/JournalEntry";
import { loadEntriesFromPublic, searchEntries } from "@/utils/journalLoader";
// 📁 Put your background image in: src/assets/background.jpg
// Then change the import below to match your image filename
import backgroundImage from "@/assets/background.jpg";

const Index = () => {
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntryData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryData | null>(null);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);

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
    setSelectedEntry(entry);
    setEntryDialogOpen(true);
  };

  return (
    <div 
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
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
        
        <EntryDialog
          entry={selectedEntry}
          open={entryDialogOpen}
          onOpenChange={setEntryDialogOpen}
        />
      </div>
    </div>
  );
};

export default Index;
