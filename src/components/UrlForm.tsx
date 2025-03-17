
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidUrl, shortenUrl, isShortCodeAvailable } from "@/utils/urlUtils";
import { toast } from "sonner";
import { isAuthenticated } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";

interface UrlFormProps {
  onUrlShortened: (data: { shortUrl: string; originalUrl: string; visits: number; createdAt: string }) => void;
}

const UrlForm: React.FC<UrlFormProps> = ({ onUrlShortened }) => {
  const [url, setUrl] = useState("");
  const [customShortCode, setCustomShortCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortCodeError, setShortCodeError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setShortCodeError(null);
    
    // Validate URL
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }
    
    if (!isValidUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }

    // Validate custom short code
    if (!customShortCode.trim()) {
      setShortCodeError("Please enter a custom short code");
      return;
    }

    // Check if the custom short code is available
    const isAvailable = await isShortCodeAvailable(customShortCode);
    if (!isAvailable) {
      setShortCodeError("This short code is already in use. Please choose another one.");
      return;
    }
    
    // Submit URL for shortening
    try {
      setIsLoading(true);
      const result = await shortenUrl(url, customShortCode);
      onUrlShortened(result);
      setUrl("");
      setCustomShortCode("");
      toast.success("URL shortened successfully!");
    } catch (err) {
      setError("Failed to shorten URL. Please try again.");
      toast.error("Failed to shorten URL");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginPrompt = () => {
    navigate('/login');
  };

  if (!authenticated) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center p-8 bg-muted/30 rounded-lg border border-border animate-fade-in">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-4 text-primary/70"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        
        <h3 className="text-xl font-semibold mb-2">Login Required</h3>
        <p className="text-muted-foreground mb-6">
          You need to be logged in to shorten URLs. Login or create an account to continue.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button onClick={() => navigate('/signup')}>
            Create Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl mx-auto animate-fade-in"
    >
      <div className="flex flex-col gap-3">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Enter your long URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12 pr-10 text-base"
            disabled={isLoading}
            aria-label="URL to shorten"
          />
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear input"
            >
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-destructive mt-1 animate-fade-in">{error}</p>
        )}

        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Enter your custom short code (e.g., mylink)"
            value={customShortCode}
            onChange={(e) => setCustomShortCode(e.target.value)}
            className="h-12 pr-10 text-base"
            disabled={isLoading}
            aria-label="Custom short code"
          />
          {customShortCode && (
            <button
              type="button"
              onClick={() => setCustomShortCode("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear input"
            >
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        
        {shortCodeError && (
          <p className="text-sm text-destructive animate-fade-in">{shortCodeError}</p>
        )}

        <Button
          type="submit"
          className="h-12 px-8 text-base font-medium transition-all w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Shortening...
            </div>
          ) : (
            "Shorten URL"
          )}
        </Button>
      </div>
    </form>
  );
};

export default UrlForm;
