import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Progress } from './components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { Upload, X, Check, AlertCircle, Image as ImageIcon, FileText, Loader2, ArrowLeft, Download, Zap } from 'lucide-react';
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

// Sample test images for different modalities
const SAMPLE_IMAGES = [
  {
    id: 'xray-chest',
    name: 'Chest X-ray',
    type: 'xray',
    description: 'Chest X-ray for pneumonia detection',
    url: '/sample_reports/BACTERIA-1135262-0001.jpeg',
    analysisType: 'pneumonia'
  },
  {
    id: 'ct-brain',
    name: 'Brain CT Scan',
    type: 'ct',
    description: 'CT scan showing brain anatomy',
    url: '/sample_reports/brain ct scan.png',
    analysisType: 'brain_tumor'
  },
  {
    id: 'mri-knee',
    name: 'Knee MRI',
    type: 'mri',
    description: 'MRI scan of knee joint',
    url: '/sample_reports/knee mri.jpg',
    analysisType: 'bone_fracture'
  },
  {
    id: 'ultrasound-abdomen',
    name: 'Abdominal Ultrasound',
    type: 'ultrasound',
    description: 'Abdominal ultrasound scan',
    url: '/sample_reports/abdominal ultarasound.png',
    analysisType: 'abdominal'
  },
  {
    id: 'ct-brain-abnormal',
    name: 'Abnormal Brain CT',
    type: 'ct',
    description: 'CT scan showing abnormal findings',
    url: '/sample_reports/abnormal barin ct scan.png',
    analysisType: 'brain_tumor'
  },
  {
    id: 'xray-bone',
    name: 'Bone X-ray',
    type: 'xray',
    description: 'X-ray showing bone structure',
    url: '/sample_reports/led xray.webp',
    analysisType: 'bone_fracture'
  },
  {
    id: 'ultrasound-liver',
    name: 'Liver Ultrasound',
    type: 'ultrasound',
    description: 'Ultrasound scan of liver',
    url: '/sample_reports/ultrasound-image-of-liver.jpg',
    analysisType: 'abdominal'
  }
];

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
  const [showSamples, setShowSamples] = useState(false);
  
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
    if (!file || !selectedImageType) {
      setError('Please select a file and image type');
      return;
    }
    
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
    
    const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/analyze`;
    
    try {
      console.log('Starting upload to:', apiUrl);
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });
      
      const response = await axios.post(
        apiUrl,
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${progress}%`);
            setUploadProgress(progress);
          },
          timeout: 30000 // 30 seconds timeout
        }
      );
      
      console.log('Upload successful:', response.data);
      setAnalysisResults(response.data);
    } catch (err) {
      console.error('Upload error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      
      let errorMessage = 'Failed to process image. Please try again.';
      
      if (err.response) {
        // Server responded with an error
        if (err.response.status === 413) {
          errorMessage = 'File is too large. Please upload a smaller file.';
        } else if (err.response.status === 415) {
          errorMessage = 'Unsupported file type. Please upload a valid image file.';
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Could not connect to the server. Please check your connection.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      }
      
      setError(errorMessage);
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
    setShowSamples(true);
  };

  const loadSampleImage = async (sample) => {
    try {
      setError(null);
      setUploading(true);
      
      // Use the public URL directly for local files
      const fileName = sample.url.split('/').pop();
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: `image/${fileName.split('.').pop()}` });
      
      setFile(file);
      setSelectedImageType(sample.type);
      setAnalysisType(sample.analysisType);
      setShowSamples(false);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      
      // Set metadata
      setFileMetadata({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        lastModifiedDate: new Date(file.lastModified).toLocaleDateString(),
      });
      
    } catch (err) {
      console.error('Error loading sample:', err);
      setError('Failed to load sample image. Please try another one.');
    } finally {
      setUploading(false);
    }
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

  const renderSampleImages = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Try with Sample Images</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          onClick={() => setShowSamples(!showSamples)}
        >
          {showSamples ? 'Hide Samples' : 'Show Samples'}
        </Button>
      </div>
      
      {showSamples && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SAMPLE_IMAGES.map((sample) => (
            <div 
              key={sample.id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer dark:border-slate-700"
              onClick={() => loadSampleImage(sample)}
            >
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <img 
                  src={sample.url} 
                  alt={sample.name}
                  className="object-cover w-full h-full hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiA2NDY0NmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMi41Ij48L2NpcmNsZT48cGF0aCBkPSJNMjEgMTVsLTMuMTg2LTMuMTg2YTIgMiAwIDAgMC0yLjYyOC0uMDYyTDYuNSAxOCI+PC9wYXRoPjwvc3ZnPg=='; // Fallback icon
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                  <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white">
                    <Zap className="h-4 w-4 mr-2" />
                    Use This Sample
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-slate-900 dark:text-white">{sample.name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{sample.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            Or upload your own image
          </span>
        </div>
      </div>
    </div>
  );

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
              <div className="space-y-4">
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

              {/* Sample Images Toggle - Moved below upload section */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                {!file && (
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Try with Sample Images</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => setShowSamples(!showSamples)}
                    >
                      {showSamples ? 'Hide Samples' : 'Show Samples'}
                    </Button>
                  </div>
                )}
                
                {showSamples && !file && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {SAMPLE_IMAGES.map((sample) => (
                      <div 
                        key={sample.id}
                        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer dark:border-slate-700"
                        onClick={() => loadSampleImage(sample)}
                      >
                        <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <img 
                            src={sample.url} 
                            alt={sample.name}
                            className="object-cover w-full h-full hover:opacity-90 transition-opacity"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiA2NDY0NmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMi41Ij48L2NpcmNsZT48cGF0aCBkPSJNMjEgMTVsLTMuMTg2LTMuMTg2YTIgMiAwIDAgMC0yLjYyOC0uMDYyTDYuNSAxOCI+PC9wYXRoPjwvc3ZnPg==';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                            <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white">
                              <Zap className="h-4 w-4 mr-2" />
                              Use This Sample
                            </Button>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-slate-900 dark:text-white">{sample.name}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{sample.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
