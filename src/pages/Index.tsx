
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrlForm from "@/components/UrlForm";
import ShortenedUrl from "@/components/ShortenedUrl";
import { getOriginalUrl, getAllShortenedUrls } from "@/utils/urlUtils";
import { isAuthenticated } from "@/utils/authUtils";

const Index = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [recentUrls, setRecentUrls] = useState<Array<{ shortUrl: string; originalUrl: string }>>([]);
  const [newUrl, setNewUrl] = useState<{ shortUrl: string; originalUrl: string } | null>(null);
  const authenticated = isAuthenticated();

  // Handle redirects if this is a shortened URL
  useEffect(() => {
    if (shortCode) {
      const originalUrl = getOriginalUrl(shortCode);
      if (originalUrl) {
        window.location.href = originalUrl;
      } else {
        // Invalid short URL, redirect to home
        navigate("/", { replace: true });
      }
    }
  }, [shortCode, navigate]);

  // Load previously shortened URLs from localStorage
  useEffect(() => {
    if (authenticated) {
      const storedUrls = getAllShortenedUrls();
      setRecentUrls(storedUrls.slice(0, 5)); // Show up to 5 recent URLs
    } else {
      setRecentUrls([]);
    }
  }, [newUrl, authenticated]);

  const handleUrlShortened = (data: { shortUrl: string; originalUrl: string }) => {
    setNewUrl(data);
  };

  const handleUrlDeleted = () => {
    // Refresh the list of URLs
    setNewUrl(null);
    if (authenticated) {
      const storedUrls = getAllShortenedUrls();
      setRecentUrls(storedUrls.slice(0, 5));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 border border-primary/20 rounded-full bg-primary/5 text-primary text-sm font-medium animate-fade-in">
            Simplify your links instantly
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-in">
            Short links, big impact
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Streamline your online experience with our fast and intuitive URL shortener. Create memorable links that are easy to share.
          </p>
        </div>
        
        <div className="w-full max-w-2xl mx-auto">
          <UrlForm onUrlShortened={handleUrlShortened} />
          
          {newUrl && (
            <ShortenedUrl
              shortUrl={newUrl.shortUrl}
              originalUrl={newUrl.originalUrl}
              onDelete={handleUrlDeleted}
            />
          )}
          
          {authenticated && recentUrls.length > 0 && !newUrl && (
            <div className="mt-16 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-center">Your recent links</h2>
              <div className="space-y-3">
                {recentUrls.map((url, index) => (
                  <ShortenedUrl
                    key={index}
                    shortUrl={url.shortUrl}
                    originalUrl={url.originalUrl}
                    onDelete={handleUrlDeleted}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="w-full max-w-5xl mx-auto mt-24 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Create shortened URLs in seconds with our streamlined interface.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Secure & Reliable</h3>
              <p className="text-sm text-muted-foreground">
                Your links are safe with us and available whenever you need them.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Easy to Use</h3>
              <p className="text-sm text-muted-foreground">
                Simple interface designed for the best user experience.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
