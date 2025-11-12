import { Search, Menu, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef, useEffect } from "react";

interface JournalHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCategoryClick: () => void;
}

export const JournalHeader = ({ searchQuery, onSearchChange, onCategoryClick }: JournalHeaderProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.warn('Video autoplay failed:', error);
      });
    }
  }, []);

  return (
    <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-center gap-4 mb-8">
        <h1 className="text-4xl sm:text-5xl font-momo text-foreground">
          "Vazhi Thirivu"
        </h1>
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-border bg-card shadow-sm flex-shrink-0 relative">
          <video
            ref={videoRef}
            src="/videos/Character_Animation_For_Website.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            onError={(e) => {
              console.error('Video failed to load:', e);
            }}
            onLoadedData={() => {
              if (videoRef.current) {
                videoRef.current.play().catch(console.warn);
              }
            }}
          />
        </div>
      </div>
      
      <div className="bg-card rounded-2xl shadow-medium p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background border-border rounded-xl"
            />
          </div>
          <Button
            onClick={onCategoryClick}
            variant="outline"
            className="rounded-xl px-4 border-border hover:bg-accent"
          >
            <Filter className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Categories</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
