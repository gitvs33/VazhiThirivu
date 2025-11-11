import { JournalEntryData } from "@/components/JournalEntry";

/**
 * This utility helps load journal entries from the public folder structure.
 * 
 * Directory structure expected:
 * public/
 *   subjects/
 *     topic-name/
 *       entry1.txt
 *       image1.png
 *       entry2.txt
 * 
 * To add your own entries:
 * 1. Create a folder in public/subjects/ with your topic name
 * 2. Add .txt files for text entries
 * 3. Add .png files for images
 * 
 * Text file format:
 * First line: Title
 * Second line: Date (YYYY-MM-DD or any format)
 * Rest: Content
 */

// Sample entries for demonstration
export const sampleEntries: JournalEntryData[] = [
  {
    id: "1",
    date: "October 26, 2023",
    title: "Autumn Reflections",
    preview: "The leaves a turning golden, and there's a crispness the air that fills me a sense with peace...",
    subject: "Nature",
    content: "The leaves a turning golden, and there's a crispness the air that fills me a sense with peace. Walking through the park today, I noticed how the light filters through the branches differently now. Everything feels quieter, more contemplative. This is my favorite time of year - a perfect moment to pause and reflect on the year so far.",
  },
  {
    id: "2",
    date: "October 25, 2023",
    title: "Morning Routine",
    preview: "Woke a early today, brewed a cup tea, and spent time meditating. It made a difference...",
    subject: "Personal",
    content: "Woke a early today, brewed a cup tea, and spent time meditating. It made a difference in how I approached the rest of the day. There's something powerful about starting with intention. I'm trying to make this a daily habit - giving myself space before the world rushes in.",
  },
  {
    id: "3",
    date: "October 24, 2023",
    title: "New Project Idea",
    preview: "Brainsstorming a new creative writing project. Thinking of fantasy fantasy story set a clockwork city.",
    subject: "Creative",
    content: "Brainsstorming a new creative writing project. Thinking of fantasy story set in a clockwork city. The idea of blending steampunk aesthetics with traditional fantasy elements feels exciting. I've been sketching out characters and world-building notes. This might be the project I've been looking for.",
  },
];

/**
 * Load entries from the public folder
 * This is a placeholder that returns sample data.
 * 
 * To implement real file loading:
 * 1. Create a manifest.json in public/subjects/ listing all entries
 * 2. Use fetch() to load the manifest and individual files
 * 3. Parse the text files and create entry objects
 */
export async function loadEntriesFromPublic(): Promise<JournalEntryData[]> {
  // In a real implementation, you would:
  // 1. Fetch a manifest file that lists all available entries
  // 2. Load each entry's content
  // 3. Parse and return the data
  
  // For now, returning sample data
  return Promise.resolve(sampleEntries);
}

/**
 * Search entries by query
 */
export function searchEntries(
  entries: JournalEntryData[],
  query: string
): JournalEntryData[] {
  if (!query.trim()) return entries;
  
  const lowerQuery = query.toLowerCase();
  return entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(lowerQuery) ||
      entry.preview.toLowerCase().includes(lowerQuery) ||
      entry.subject.toLowerCase().includes(lowerQuery) ||
      entry.content?.toLowerCase().includes(lowerQuery)
  );
}
