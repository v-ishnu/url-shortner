
import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "@/utils/authUtils";
import { Button } from "@/components/ui/button";

const Header = () => {
  const authenticated = isAuthenticated();

  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2 transition-all duration-300 hover:opacity-80"
        >
          <div className="w-12 h-12 rounded-md flex items-center justify-center text-primary-foreground">
            <img src="logo" alt="Logo" />
          </div>
          <span className="">shortner</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>

          {authenticated ? (
            <Link
              to="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>

              <Button asChild size="sm">
                <Link to="/signup">
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="16" y1="11" x2="22" y2="11" />
                  </svg>
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
