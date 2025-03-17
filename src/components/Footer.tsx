
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
              <div className="w-12 h-12 rounded-md flex items-center justify-center text-primary-foreground">
                <img src="logo" alt="Logo" />
              </div>
              <span className="">shortner</span>
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
              © {currentYear} iX. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
