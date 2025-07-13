import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Button } from "./ui/button"
import { ModeToggle } from './ui/mode-toggle';
import { FileText, Home, Search, Pill, Menu, X } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-accent' : '';
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80 backdrop:blur-lg">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold transition-colors group">
            <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14">
              <img src={logo} alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MedInsight</span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Button 
              asChild 
              variant="ghost" 
              size="sm" 
              className={isActive('/') ? 'bg-accent' : ''}
            >
              <Link to="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className={isActive('/diagnosis') ? 'bg-accent' : ''}
            >
              <Link to="/diagnosis" className="flex items-center gap-1">
                <Search className="h-4 w-4" />
                <span>Symptom Checker</span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className={isActive('/upload') ? 'bg-accent' : ''}
            >
              <Link to="/upload" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>AI Analysis</span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className={isActive('/medication-reminders') ? 'bg-accent' : ''}
            >
              <Link to="/medication-reminders" className="flex items-center gap-1">
                <Pill className="h-4 w-4" />
                <span>Medication</span>
              </Link>
            </Button>

            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className={isActive('/diagnostic-centres') ? 'bg-accent' : ''}
            >
              <Link to="/diagnostic-centres" className="flex items-center gap-1">
                <span role="img" aria-label="diagnostic">🏥</span>
                <span>Diagnostic Centres</span>
              </Link>
            </Button>

            {/* Theme Toggle - Desktop */}
            <div className="ml-2">
              <ModeToggle />
            </div>
          </nav>
          
          {/* Mobile Menu and Theme Toggle */}
          <div className="flex items-center gap-1 md:hidden">
            <div className="ml-1">
              <ModeToggle />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-gray-800">
          <nav className="container py-2 px-4 flex flex-col gap-1">
            <Button 
              asChild 
              variant="ghost" 
              size="sm" 
              className={`justify-start ${isActive('/') ? 'bg-accent' : ''}`}
            >
              <Link to="/" className="w-full flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="ghost" 
              size="sm" 
              className={`justify-start ${isActive('/diagnosis') ? 'bg-accent' : ''}`}
            >
              <Link to="/diagnosis" className="w-full flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Symptom Checker</span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="ghost" 
              size="sm" 
              className={`justify-start ${isActive('/upload') ? 'bg-accent' : ''}`}
            >
              <Link to="/upload" className="w-full flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>AI Analysis</span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="ghost" 
              size="sm" 
              className={`justify-start ${isActive('/medication-reminders') ? 'bg-accent' : ''}`}
            >
              <Link to="/medication-reminders" className="w-full flex items-center gap-2">
                <Pill className="h-4 w-4" />
                <span>Medication</span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="ghost" 
              size="sm" 
              className={`justify-start ${isActive('/diagnostic-centres') ? 'bg-accent' : ''}`}
            >
              <Link to="/diagnostic-centres" className="w-full flex items-center gap-2">
                <span role="img" aria-label="diagnostic" className="text-base">🏥</span>
                <span>Diagnostic Centres</span>
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;