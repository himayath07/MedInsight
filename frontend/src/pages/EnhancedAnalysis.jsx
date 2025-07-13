import React from 'react';
import { Helmet } from 'react-helmet-async';
import EnhancedImageAnalysis from '../components/EnhancedImageAnalysis';

const EnhancedAnalysis = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Enhanced Medical Image Analysis | MedInsight AI</title>
        <meta 
          name="description" 
          content="Advanced AI-powered medical image analysis for detecting fractures, tumors, nodules, and other abnormalities in various medical imaging modalities." 
        />
      </Helmet>
      
      <main className="container mx-auto px-4 py-8">
        <EnhancedImageAnalysis />
      </main>
    </div>
  );
};

export default EnhancedAnalysis;
