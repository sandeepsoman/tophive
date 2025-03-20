
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 backdrop-blur-lg bg-white/70 dark:bg-black/70 shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container px-6 lg:px-8 mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">TH</span>
          </span>
          <span className="font-semibold text-lg">TopHive</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/') ? 'text-primary' : 'text-foreground/70'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/features') ? 'text-primary' : 'text-foreground/70'
            }`}
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/pricing') ? 'text-primary' : 'text-foreground/70'
            }`}
          >
            Pricing
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="transition-all">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="shadow-sm hover:shadow-md transition-all">
              Sign Up
            </Button>
          </Link>
        </div>
        
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-foreground p-2 rounded-md"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border md:hidden animate-fade-in">
          <nav className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`text-sm font-medium p-2 rounded-md transition-colors ${
                isActive('/') ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className={`text-sm font-medium p-2 rounded-md transition-colors ${
                isActive('/features') ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium p-2 rounded-md transition-colors ${
                isActive('/pricing') ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-border">
              <Link 
                to="/login" 
                className="w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link 
                to="/signup" 
                className="w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button className="w-full justify-center">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
