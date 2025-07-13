import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { RefreshCw, Home } from 'lucide-react';

const ServerError = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-white dark:from-zinc-900 dark:to-red-900/10 p-4">
      <div className="text-center max-w-2xl mx-auto space-y-6">
        <h1 className="text-9xl font-bold text-red-600 dark:text-red-400">500</h1>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Server Error</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Something went wrong on our end. We're already fixing it!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button 
            onClick={handleRefresh}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
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

export default ServerError;
