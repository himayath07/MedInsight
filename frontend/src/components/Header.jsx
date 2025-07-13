import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Button } from "./ui/button"
import { ModeToggle } from './ui/mode-toggle';
import { FileText, Home, Stethoscope, Search, Pill } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-accent' : '';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80 backdrop:blur-lg">
  <style>{`
    @media (max-width: 768px) {
      #mobile-nav-menu { display: block; }
      #main-nav-menu { display: none; }
    }
    @media (min-width: 769px) {
      #mobile-nav-menu { display: none; }
      #main-nav-menu { display: flex; }
    }
  `}</style>
      <div className="container flex h-20 items-center justify-between px-2 sm:px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold transition-colors group">
        <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14">
           <img src={logo} alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
        </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MedInsight</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">AI-Powered Diagnosis</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-1">
          {/* Mobile nav toggle */}
          <div className="md:hidden flex items-center">
            <button id="mobile-nav-toggle" className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6 text-blue-700 dark:text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
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
                <span>AI Aalysis</span>
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
          </nav>
{/* Mobile nav menu */}
<nav id="mobile-nav-menu" className="flex flex-col gap-2 bg-white dark:bg-zinc-950 p-4 rounded-lg shadow-lg absolute top-20 left-2 right-2 z-50" style={{display:'none'}}>
  <Button asChild variant="ghost" size="sm" className={isActive('/') ? 'bg-accent' : ''}>
    <Link to="/" className="flex items-center gap-1"><Home className="h-4 w-4" /><span>Home</span></Link>
  </Button>
  <Button asChild variant="ghost" size="sm" className={isActive('/diagnosis') ? 'bg-accent' : ''}>
    <Link to="/diagnosis" className="flex items-center gap-1"><Search className="h-4 w-4" /><span>Symptom Checker</span></Link>
  </Button>
  <Button asChild variant="ghost" size="sm" className={isActive('/upload') ? 'bg-accent' : ''}>
    <Link to="/upload" className="flex items-center gap-1"><FileText className="h-4 w-4" /><span>AI Analysis</span></Link>
  </Button>
  <Button asChild variant="ghost" size="sm" className={isActive('/medication-reminders') ? 'bg-accent' : ''}>
    <Link to="/medication-reminders" className="flex items-center gap-1"><Pill className="h-4 w-4" /><span>Medication</span></Link>
  </Button>
  <Button asChild variant="ghost" size="sm" className={isActive('/diagnostic-centres') ? 'bg-accent' : ''}>
    <Link to="/diagnostic-centres" className="flex items-center gap-1"><span role="img" aria-label="diagnostic">🏥</span><span>Diagnostic Centres</span></Link>
  </Button>
</nav>
<script>{`
  document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('mobile-nav-toggle');
    const menu = document.getElementById('mobile-nav-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function() {
        if (menu.style.display === 'none' || menu.style.display === '') {
          menu.style.display = 'flex';
        } else {
          menu.style.display = 'none';
        }
      });
    }
  });
`}</script>
          
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;