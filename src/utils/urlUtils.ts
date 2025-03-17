import { getCurrentUser } from "./authUtils";

/**
 * Validates if the provided string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    // Add http:// if no protocol is specified
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      url = 'http://' + url;
    }
    
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Normalize a URL by ensuring it has a protocol
 */
export const normalizeUrl = (url: string): string => {
  if (!url.match(/^[a-zA-Z]+:\/\//)) {
    return 'http://' + url;
  }
  return url;
};

/**
 * Generate a short code for URLs (used as fallback only)
 */
export const generateShortCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 6;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

/**
 * Check if a custom short code is available
 */
export const isShortCodeAvailable = async (shortCode: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '{}');
  return !storedUrls.hasOwnProperty(shortCode);
};

interface UrlData {
  userId: string | null;
  originalUrl: string;
  visits: number;
  createdAt: string;
}

interface ShortenedUrlData {
  shortUrl: string;
  originalUrl: string;
  visits: number;
  createdAt: string;
}

/**
 * URL shortening function with custom short code
 */
export const shortenUrl = async (url: string, customShortCode?: string): Promise<ShortenedUrlData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Use the provided custom short code or generate one if not provided
  const shortCode = customShortCode || generateShortCode();
  const shortUrl = `${window.location.origin}/${shortCode}`;
  const normalizedUrl = normalizeUrl(url);
  const currentUser = getCurrentUser();
  
  // In a real app, this would store the URL mapping in a database
  const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '{}');
  
  // Check if the short code already exists (should not happen with the prior validation)
  if (storedUrls[shortCode] && customShortCode) {
    throw new Error('Short code already in use');
  }
  
  // Store URL with user info and visit count
  storedUrls[shortCode] = {
    userId: currentUser ? currentUser.id : null,
    originalUrl: normalizedUrl,
    visits: 0,
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem('shortenedUrls', JSON.stringify(storedUrls));
  
  return {
    shortUrl,
    originalUrl: normalizedUrl,
    visits: 0,
    createdAt: new Date().toISOString()
  };
};

/**
 * Delete a shortened URL by its short code
 */
export const deleteShortUrl = async (shortUrl: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Extract the short code from the URL
  const shortCode = shortUrl.split('/').pop();
  if (!shortCode) return false;
  
  const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '{}');
  const currentUser = getCurrentUser();
  
  // Check if URL exists and belongs to current user
  if (!storedUrls[shortCode] || 
      (storedUrls[shortCode].userId !== currentUser?.id && storedUrls[shortCode].userId !== null)) {
    return false;
  }
  
  // Delete the URL
  delete storedUrls[shortCode];
  localStorage.setItem('shortenedUrls', JSON.stringify(storedUrls));
  
  return true;
};

/**
 * Get the original URL from a short code and record a visit
 */
export const getOriginalUrl = (shortCode: string): string | null => {
  const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '{}');
  const urlData = storedUrls[shortCode];
  
  if (!urlData) return null;
  
  // Increment visit count
  urlData.visits += 1;
  storedUrls[shortCode] = urlData;
  localStorage.setItem('shortenedUrls', JSON.stringify(storedUrls));
  
  return urlData.originalUrl;
};

/**
 * Get all stored shortened URLs
 */
export const getAllShortenedUrls = (): Array<ShortenedUrlData> => {
  const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '{}');
  
  return Object.entries(storedUrls).map(([shortCode, data]) => {
    const urlData = data as UrlData;
    return {
      shortUrl: `${window.location.origin}/${shortCode}`,
      originalUrl: urlData.originalUrl,
      visits: urlData.visits,
      createdAt: urlData.createdAt
    };
  });
};

/**
 * Get all URLs created by the current user
 */
export const getAllUserUrls = async (): Promise<Array<ShortenedUrlData>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  
  const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '{}');
  
  return Object.entries(storedUrls)
    .filter(([, data]) => (data as UrlData).userId === currentUser.id)
    .map(([shortCode, data]) => {
      const urlData = data as UrlData;
      return {
        shortUrl: `${window.location.origin}/${shortCode}`,
        originalUrl: urlData.originalUrl,
        visits: urlData.visits,
        createdAt: urlData.createdAt
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
