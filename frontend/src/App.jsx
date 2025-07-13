import React, { useState, Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UploadPage from './UploadPage';
import ResultPage from './ResultPage';
import Header from "./components/Header";
import DiagnosticCentres from "./pages/DiagnosticCentres";
import Contact from './Contact';
import ResultChatPage from './ResultChatPage';
import BloodSugarAnalysis from './BloodSugarAnalysis';
import EnhancedAnalysis from './pages/EnhancedAnalysis';
import DiagnosisSearchPage from './DiagnosisSearchPage';

import MedicationReminder from './components/medication/MedicationReminder';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';

function App() {
  // Global state for selected image type and processed data
  const [selectedImageType, setSelectedImageType] = useState(null);
  const [processedData, setProcessedData] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/upload" 
              element={
                <UploadPage 
                  selectedImageType={selectedImageType} 
                  setSelectedImageType={setSelectedImageType} 
                  setProcessedData={setProcessedData} 
                />
            } 
          />
          <Route 
            path="/results" 
            element={
              <ResultPage 
                processedData={processedData} 
                selectedImageType={selectedImageType} 
              />
            } 
          />
          <Route path="/resultchat" element={<ResultChatPage />} />
<Route path="/blood-sugar" element={<BloodSugarAnalysis />} />
          <Route path="/enhanced-analysis" element={<EnhancedAnalysis />} />
          <Route path="/contact" element={<Contact />} />
<Route path="/diagnostic-centres" element={<DiagnosticCentres />} />
          <Route path="/diagnosis" element={<DiagnosisSearchPage />} />

          <Route path="/medication-reminders" element={<MedicationReminder />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ServerError />;
    }

    return this.props.children;
  }
}

export default App;
