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

/**
 * Parse a text file into a journal entry
 * Format:
 * Line 1: Title
 * Line 2: Date
 * Rest: Content
 */
function parseEntryFile(fileContent: string, topic: string, filename: string): JournalEntryData | null {
  // Split by newlines - keep all lines to preserve structure
  const allLines = fileContent.split('\n');
  
  // Find first non-empty line (title)
  const titleIndex = allLines.findIndex(line => line.trim().length > 0);
  if (titleIndex === -1) return null;
  
  // Find second non-empty line (date) - must be after title
  const dateIndex = allLines.slice(titleIndex + 1).findIndex(line => line.trim().length > 0);
  if (dateIndex === -1) return null;
  
  const actualDateIndex = titleIndex + 1 + dateIndex;
  
  // Get title and date
  const title = allLines[titleIndex].trim();
  const date = allLines[actualDateIndex].trim();
  
  // Validate we have at least title and date
  if (!title || !date) return null;
  
  // Get content (everything after date line, preserving line breaks)
  const entryContent = allLines.slice(actualDateIndex + 1).join('\n').trim();
  
  const preview = entryContent.length > 100 ? entryContent.substring(0, 100) + '...' : entryContent;

  // Use filename without extension as ID
  const id = filename.replace(/\.txt$/i, '');

  return {
    id: `${topic}-${id}`,
    date,
    title,
    preview,
    subject: topic,
    content: entryContent || preview,
  };
}

/**
 * Load entries from a topic folder
 */
async function loadTopicEntries(topic: string, entryFiles: string[]): Promise<JournalEntryData[]> {
  const entries: JournalEntryData[] = [];
  const images: string[] = [];

  // Separate text files and image files
  const textFiles = entryFiles.filter(file => file.toLowerCase().endsWith('.txt'));
  const imageFiles = entryFiles.filter(file =>
    file.toLowerCase().endsWith('.jpg') ||
    file.toLowerCase().endsWith('.jpeg') ||
    file.toLowerCase().endsWith('.png') ||
    file.toLowerCase().endsWith('.gif') ||
    file.toLowerCase().endsWith('.webp')
  );

  // Collect image URLs
  for (const imageFile of imageFiles) {
    images.push(`/subjects/${topic}/${imageFile}`);
  }

  for (const file of textFiles) {
    try {
      // Try exact case first, then try different case variations
      const url = `/subjects/${topic}/${file}`;
      console.log(`Fetching: ${url}`);
      let response = await fetch(url, {
        cache: 'no-store' // Ensure fresh data on each page load
      });

      // If exact case fails, try lowercase folder name
      if (!response.ok && topic !== topic.toLowerCase()) {
        const lowerUrl = `/subjects/${topic.toLowerCase()}/${file}`;
        console.log(`Trying lowercase: ${lowerUrl}`);
        response = await fetch(lowerUrl, {
          cache: 'no-store'
        });
      }

      if (!response.ok) {
        console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        console.error(`Make sure the folder name matches exactly: ${topic}`);
        continue;
      }

      const content = await response.text();
      console.log(`Loaded content for ${file}, length: ${content.length}`);

      // Check if we got HTML instead of text (404 error page)
      if (content.trim().toLowerCase().startsWith('<!doctype') || content.trim().toLowerCase().startsWith('<html')) {
        console.error(`❌ Received HTML instead of text file for ${file}. File might not exist or path is wrong.`);
        console.error(`Expected path: /subjects/${topic}/${file}`);
        console.error(`Make sure the folder name in manifest.json matches the actual folder name exactly.`);
        continue;
      }

      const entry = parseEntryFile(content, topic, file);
      if (entry) {
        // Add images to the entry
        entry.images = images;
        console.log(`✅ Successfully parsed entry: "${entry.title}" from topic: ${topic} with ${images.length} images`);
        entries.push(entry);
      } else {
        console.error(`❌ Failed to parse entry from ${file}`);
        console.error(`File format should be:\nLine 1: Title\nLine 2: Date\nLine 3+: Content`);
        console.error(`First 100 chars of file: ${content.substring(0, 100)}`);
      }
    } catch (error) {
      console.error(`❌ Failed to load entry ${file} from topic ${topic}:`, error);
    }
  }

  return entries;
}

/**
 * Load entries from the public folder structure
 * Expected structure:
 * public/subjects/manifest.json - lists topics and their entry files
 * public/subjects/{topic}/entry.txt - individual entry files
 */
export async function loadEntriesFromPublic(): Promise<JournalEntryData[]> {
  try {
    // Load manifest.json from public/subjects/
    // In production, Vercel will serve fresh files on each deployment
    const manifestResponse = await fetch('/subjects/manifest.json', {
      cache: 'no-store' // Ensure fresh data on each page load
    });
    if (!manifestResponse.ok) {
      console.warn('No manifest.json found in /subjects/. Returning empty entries.');
      return [];
    }

    const manifest = await manifestResponse.json();
    console.log('Loaded manifest:', manifest);
    
    // Validate manifest structure
    if (!manifest.topics || !Array.isArray(manifest.topics)) {
      console.warn('Invalid manifest.json structure. Expected { topics: [...] }');
      return [];
    }

    // Load entries from all topics
    const allEntries: JournalEntryData[] = [];
    
    for (const topicData of manifest.topics) {
      const topic = topicData.name || topicData.topic;
      const files = topicData.files || topicData.entries || [];

      if (!topic || !Array.isArray(files)) {
        console.warn(`Invalid topic data:`, topicData);
        continue;
      }

      console.log(`Loading entries for topic: ${topic}, files:`, files);
      const topicEntries = await loadTopicEntries(topic, files);
      console.log(`Loaded ${topicEntries.length} entries for topic: ${topic}`);
      allEntries.push(...topicEntries);
    }
    
    console.log(`Total entries loaded: ${allEntries.length}`);

    // Sort entries by date (newest first)
    // Handle invalid dates gracefully
    allEntries.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      // If dates are invalid, keep original order
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      
      return dateB - dateA;
    });

    return allEntries;
  } catch (error) {
    console.error('Error loading entries from public folder:', error);
    return [];
  }
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
