
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrlForm from "@/components/UrlForm";
import ShortenedUrl from "@/components/ShortenedUrl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/utils/authUtils";
import { getAllUserUrls } from "@/utils/urlUtils";

interface UrlData {
  shortUrl: string;
  originalUrl: string;
  visits: number;
  createdAt: string;
}

const Dashboard = () => {
  const [userUrls, setUserUrls] = useState<UrlData[]>([]);
  const [newUrl, setNewUrl] = useState<UrlData | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);
      
      // Load user's URLs
      const urls = await getAllUserUrls();
      setUserUrls(urls);
    };
    
    checkAuth();
  }, [navigate]);

  const handleUrlShortened = (data: UrlData) => {
    setNewUrl(data);
    // Refresh the URLs list
    getAllUserUrls().then(setUserUrls);
  };

  const handleUrlDeleted = () => {
    // Refresh the URLs list
    setNewUrl(null);
    getAllUserUrls().then(setUserUrls);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              {user && (
                <p className="text-muted-foreground mt-1">
                  Welcome back, {user.name}!
                </p>
              )}
            </div>
            
            <Button variant="outline" onClick={handleLogout} className="mt-4 md:mt-0">
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
                className="mr-2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </Button>
          </div>
          
          <Card className="mb-10">
            <CardHeader>
              <CardTitle>Shorten a new URL</CardTitle>
            </CardHeader>
            <CardContent>
              <UrlForm onUrlShortened={handleUrlShortened} />
              
              {newUrl && (
                <ShortenedUrl
                  shortUrl={newUrl.shortUrl}
                  originalUrl={newUrl.originalUrl}
                  visits={newUrl.visits}
                  createdAt={newUrl.createdAt}
                  onDelete={handleUrlDeleted}
                />
              )}
            </CardContent>
          </Card>
          
          {userUrls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your shortened URLs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userUrls.map((url, index) => (
                    <ShortenedUrl
                      key={index}
                      shortUrl={url.shortUrl}
                      originalUrl={url.originalUrl}
                      visits={url.visits}
                      createdAt={url.createdAt}
                      onDelete={handleUrlDeleted}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {userUrls.length === 0 && !newUrl && (
            <div className="text-center py-12 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4 text-muted-foreground/50"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <p>You haven't created any shortened URLs yet.</p>
              <p className="mt-1">Create your first one above!</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
