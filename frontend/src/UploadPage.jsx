import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Progress } from './components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { Upload, X, Check, AlertCircle, Image as ImageIcon, FileText, Loader2, ArrowLeft } from 'lucide-react';
import ImageTypeSelector from './components/ImageTypeSelector';
import EnhancedAnalysisResults from './components/EnhancedAnalysisResults';

// Supported file types
const ACCEPTED_FILE_TYPES = {
  'image/*': ['.jpeg', '.jpg', '.png', '.dcm', '.dicom', '.tiff', '.tif'],
};

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileMetadata, setFileMetadata] = useState(null);
  const [selectedImageType, setSelectedImageType] = useState(null);
  const [analysisType, setAnalysisType] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const navigate = useNavigate();

  const extractImageMetadata = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate?.toLocaleDateString(),
          });
        };
        img.src = e.target.result;
      };
      
      reader.readAsDataURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setError(null);
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejectedFile = rejectedFiles[0];
      if (rejectedFile.errors.some(e => e.code === 'file-too-large')) {
        setError(`File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`);
      } else if (rejectedFile.errors.some(e => e.code === 'file-invalid-type')) {
        setError('Invalid file type. Please upload an image file (JPEG, PNG, DICOM).');
      } else {
        setError('Error processing file. Please try again.');
      }
      return;
    }
    
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.onerror = () => setError('Error reading file. Please try another file.');
    reader.readAsDataURL(selectedFile);
    
    // Extract and set metadata
    try {
      const metadata = await extractImageMetadata(selectedFile);
      setFileMetadata(metadata);
    } catch (err) {
      console.error('Error extracting metadata:', err);
      setError('Error extracting image metadata');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file || !selectedImageType) return;
    
    // Handle blood sugar analysis separately
    if (selectedImageType === 'blood_sugar') {
      navigate('/blood-sugar');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('analysisType', analysisType || selectedImageType);
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/analyze`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        }
      );
      
      setAnalysisResults(response.data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.detail || 'Failed to process image. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setFileMetadata(null);
    setSelectedImageType(null);
    setAnalysisType(null);
    setError(null);
  };

  // Handle analysis results view
  if (analysisResults) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button 
          variant="ghost" 
          onClick={() => setAnalysisResults(null)}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to upload
        </Button>
        <EnhancedAnalysisResults results={analysisResults} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          asChild 
          className="mb-6 -ml-2"
        >
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-blue-600 dark:hover:text-blue-400">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        
        <Card className="mb-8 shadow-md dark:shadow-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Upload Medical Images
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Upload CT, MRI, X-ray, or Ultrasound images for AI-powered analysis
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Select Image Type
              </h3>
              <ImageTypeSelector 
                selectedImageType={selectedImageType}
                setSelectedImageType={setSelectedImageType}
                setAnalysisType={setAnalysisType}
              />
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              {!preview ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-10 w-10 text-gray-400" />
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {isDragActive ? (
                        <p>Drop the image here</p>
                      ) : (
                        <p>Drag & drop an image here, or click to select</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Supported formats: JPG, PNG, DICOM (Max {formatFileSize(MAX_FILE_SIZE)})
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-64 object-contain bg-gray-100 dark:bg-gray-800"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700"
                      onClick={resetUpload}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {fileMetadata && (
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div>
                        <p className="font-medium">File Name:</p>
                        <p className="truncate">{file.name}</p>
                      </div>
                      <div>
                        <p className="font-medium">File Size:</p>
                        <p>{formatFileSize(file.size)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Dimensions:</p>
                        <p>{fileMetadata.width} × {fileMetadata.height}px</p>
                      </div>
                      <div>
                        <p className="font-medium">Type:</p>
                        <p>{file.type || 'Unknown'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                {preview && (
                  <Button
                    variant="outline"
                    onClick={resetUpload}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleUpload}
                  disabled={!preview || !selectedImageType || uploading}
                  className="min-w-[120px]"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Image'
                  )}
                </Button>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-100 dark:border-gray-700 rounded-b-lg">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>Your data is processed securely and never stored permanently.</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UploadPage;
