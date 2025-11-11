import { useState, useEffect } from "react";
import { JournalHeader } from "@/components/JournalHeader";
import { NewEntryButton } from "@/components/NewEntryButton";
import { EntryList } from "@/components/EntryList";
import { JournalEntryData } from "@/components/JournalEntry";
import { loadEntriesFromPublic, searchEntries } from "@/utils/journalLoader";
import { useToast } from "@/hooks/use-toast";

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

  const handleNewEntry = () => {
    toast({
      title: "Create New Entry",
      description: "To add entries, create folders in public/subjects/ and add .txt or .png files",
    });
  };

  const handleEntryClick = (entry: JournalEntryData) => {
    toast({
      title: entry.title,
      description: entry.content || entry.preview,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <JournalHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <NewEntryButton onClick={handleNewEntry} />
      <EntryList entries={filteredEntries} onEntryClick={handleEntryClick} />
    </div>
  );
};

export default Index;
