import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import { Alert, AlertDescription } from "./components/ui/alert";
import { FileText, UploadCloud, X, Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BloodSugarAnalysis = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      setError('Please upload a valid PDF or image file (PDF, JPEG, PNG) up to 5MB');
      return;
    }

    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  const analyzeReport = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setUploadProgress(30);
      
      const response = await axios.post('http://localhost:8000/analyze-sugar-report', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setUploadProgress(100);
      setAnalysisResult(response.data);
      setError(null);
    } catch (err) {
      console.error('Error analyzing report:', err);
      setError('Failed to analyze report. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
            Blood Sugar Analysis
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Upload your blood sugar test report for AI-powered analysis
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!file ? (
            <div 
              {...getRootProps({
                className: `border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
                } ${isDragReject ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}`
              })}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4">
                <UploadCloud className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {isDragActive 
                      ? 'Drop your report here' 
                      : isDragReject
                      ? 'File type not supported'
                      : 'Drag & drop your blood sugar report here'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Supported formats: PDF, JPEG, PNG (max 5MB)
                  </p>
                  <p className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
                    or click to select a file
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {preview && (
                <div className="mt-4 flex justify-center">
                  <img 
                    src={preview} 
                    alt="Report preview" 
                    className="max-h-64 max-w-full rounded border border-gray-200 dark:border-gray-700" 
                  />
                </div>
              )}

              {uploading && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Analyzing report...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {analysisResult && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">Analysis Complete</h3>
              <div className="space-y-2 text-green-700 dark:text-green-300">
                <p><span className="font-medium">Fasting Blood Sugar:</span> {analysisResult.fasting || 'N/A'}</p>
                <p><span className="font-medium">Post-Prandial Blood Sugar:</span> {analysisResult.postPrandial || 'N/A'}</p>
                <p><span className="font-medium">HbA1c:</span> {analysisResult.hba1c || 'N/A'}</p>
                <p className="font-medium">
                  Status: <span className={analysisResult.status === 'Normal' ? 'text-green-600' : 'text-red-600'}>
                    {analysisResult.status}
                  </span>
                </p>
                <p className="text-sm mt-2">{analysisResult.recommendations}</p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {file && !uploading && !analysisResult && (
            <Button 
              onClick={analyzeReport}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : 'Analyze Report'}
            </Button>
          )}
          {analysisResult && (
            <Button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Home
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BloodSugarAnalysis;
