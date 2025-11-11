import { useState, useEffect } from "react";
import { JournalHeader } from "@/components/JournalHeader";
import { EntryList } from "@/components/EntryList";
import { JournalEntryData } from "@/components/JournalEntry";
import { loadEntriesFromPublic, searchEntries } from "@/utils/journalLoader";
import { useToast } from "@/hooks/use-toast";
import journalBg from "@/assets/journal-bg.jpg";

const Index = () => {
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntryData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadEntriesFromPublic().then((loadedEntries) => {
      setEntries(loadedEntries);
      setFilteredEntries(loadedEntries);
    });
  }, []);

  useEffect(() => {
    const results = searchEntries(entries, searchQuery);
    setFilteredEntries(results);
  }, [searchQuery, entries]);

  const handleCategoryClick = () => {
    toast({
      title: "Categories",
      description: "Filter by: " + [...new Set(entries.map(e => e.subject))].join(", "),
    });
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
      </div>
    </div>
  );
};

export default Index;
