import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-800 p-4">
      <div className="text-center max-w-2xl mx-auto space-y-6">
        <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400">404</h1>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Oops! We couldn't find that page. Let's get you back on track!
        </p>
        <div className="pt-6">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
