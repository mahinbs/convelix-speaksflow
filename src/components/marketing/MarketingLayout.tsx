
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Menu, X, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ChatBot } from './ChatBot';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.8;
      setIsScrolled(window.scrollY > scrollThreshold);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-sm' 
          : 'bg-background/80 backdrop-blur-md border-b border-border/60'
      }`}>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex py-3 md:py-2 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Logo imgClassName="max-w-[4rem] sm:max-w-[5rem] md:max-w-[6rem] w-full" />
              </Link>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              <Link to="/auth">
                <Button 
                   
                  size="sm" 
                  className="shadow-md"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button 
                  size="sm" 
                  className="shadow-md"
                >
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button 
                 
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="text-foreground hover:bg-accent touch-manipulation min-h-[44px] min-w-[44px]"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-xl">
              <div className="space-y-1 px-2 pb-4 pt-4">
                <div className="flex flex-col gap-3">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                       
                      size="sm" 
                      className="w-full shadow-md touch-manipulation min-h-[48px]"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      size="sm" 
                      className="w-full shadow-md touch-manipulation min-h-[48px]"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-brand-950 text-brand-50 border-t border-brand-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Company info */}
            <div className="space-y-4 text-center md:text-left">
              <Logo size="2xl" />
              <p className="text-brand-200/90 text-sm">
                Stop lead delay with automated follow-ups for sales.
                Our B2B follow-up automation tool keeps your sales pipeline moving 24/7.
              </p>
              
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <Mail className="h-5 w-5 text-brand-300" />
                <span className="text-sm text-brand-100">support@Convelix.com</span>
              </div>
            </div>

            {/* Product */}
            <div className="text-center md:text-left">
              <h3 className="text-sm font-semibold mb-4 text-brand-100">Product</h3>
              <ul className="space-y-3 text-sm text-brand-200/90">
                <li>
                  <Link to="/auth" className="hover:text-brand-50 transition-colors touch-manipulation block py-1">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link to="/auth" className="hover:text-brand-50 transition-colors touch-manipulation block py-1">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-50 transition-colors touch-manipulation block py-1">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="text-center md:text-left">
              <h3 className="text-sm font-semibold mb-4 text-brand-100">Company</h3>
              <ul className="space-y-3 text-sm text-brand-200/90">
                <li>
                  <a href="#" className="hover:text-brand-50 transition-colors touch-manipulation block py-1">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-50 transition-colors touch-manipulation block py-1">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-50 transition-colors touch-manipulation block py-1">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-50 transition-colors touch-manipulation block py-1">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-brand-800 text-center">
            <p className="text-sm text-brand-300">© {new Date().getFullYear()} Convelix</p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Bot */}
      <ChatBot />
    </div>
  );
};
