
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <Link 
              to="/" 
              className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2"
            >
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-4 h-4" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V8.625M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19" />
                </svg>
              </div>
              <span>Brevity</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Simplify and share your links efficiently.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-4">
              <Link 
                to="/privacy" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link 
                to="/contact" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              © {currentYear} Brevity. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
