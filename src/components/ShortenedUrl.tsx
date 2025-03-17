
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { deleteShortUrl } from "@/utils/urlUtils";
import { isAuthenticated } from "@/utils/authUtils";

interface ShortenedUrlProps {
  shortUrl: string;
  originalUrl: string;
  visits?: number;
  createdAt?: string;
  onDelete?: () => void;
}

const ShortenedUrl: React.FC<ShortenedUrlProps> = ({
  shortUrl,
  originalUrl,
  visits = 0,
  createdAt,
  onDelete
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isAuth = isAuthenticated();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setIsCopied(true);
      toast.success("URL copied to clipboard!");
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this shortened URL?")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const success = await deleteShortUrl(shortUrl);
      if (success) {
        toast.success("URL deleted successfully");
        if (onDelete) onDelete();
      } else {
        toast.error("Failed to delete URL");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format the original URL for display
  const formatOriginalUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      let displayUrl = urlObj.hostname + urlObj.pathname;
      
      // Truncate if too long
      if (displayUrl.length > 40) {
        displayUrl = displayUrl.substring(0, 37) + "...";
      }
      
      return displayUrl;
    } catch (e) {
      return url;
    }
  };
  
  // Format the creation date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto hover-lift animate-slide-up overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <h3 className="font-medium text-sm text-muted-foreground">
                Your shortened URL
              </h3>
            </div>
            
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium text-lg mt-1 hover:underline truncate"
            >
              {shortUrl}
            </a>
            
            <p className="text-sm text-muted-foreground mt-1 truncate">
              Original: {formatOriginalUrl(originalUrl)}
            </p>
            
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>{visits} {visits === 1 ? 'visit' : 'visits'}</span>
              </div>
              
              {createdAt && (
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Created {formatDate(createdAt)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {isAuth && (
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </div>
                )}
              </Button>
            )}
            
            <Button
              onClick={copyToClipboard}
              variant={isCopied ? "outline" : "default"}
              size="sm"
              className="min-w-24 transition-all duration-300"
            >
              {isCopied ? (
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Copied!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </div>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShortenedUrl;
