import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, Check, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const ANALYSIS_TYPES = [
  { id: 'fracture', label: 'Bone Fractures', description: 'Detect fractures in X-ray and CT scans' },
  { id: 'lung_nodule', label: 'Lung Nodules', description: 'Identify nodules in chest CT scans' },
  { id: 'brain_tumor', label: 'Brain Tumors', description: 'Detect and classify brain tumors in MRI scans' },
  { id: 'retinal', label: 'Retinal Analysis', description: 'Analyze retinal images for diseases' },
  { id: 'organ', label: 'Organ Analysis', description: 'Detect abnormalities in organ images' },
];

const EnhancedImageAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysisType, setAnalysisType] = useState(ANALYSIS_TYPES[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResults(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.dcm'],
    },
    maxFiles: 1,
  });

  // Handle analysis submission
  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image file first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const endpoint = `http://localhost:8000/analyze/${analysisType.replace('_', '-')}`;
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle zoom
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(0.5, prev - 0.2));
  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle image drag for panning
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Advanced Medical Image Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel - Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={analysisType} 
                onValueChange={setAnalysisType}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 gap-2 mb-4">
                  {ANALYSIS_TYPES.map((type) => (
                    <TabsTrigger key={type.id} value={type.id} className="text-xs">
                      {type.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {ANALYSIS_TYPES.map((type) => (
                  <TabsContent key={type.id} value={type.id} className="text-sm text-muted-foreground">
                    {type.description}
                  </TabsContent>
                ))}
              </Tabs>
              
              <div 
                {...getRootProps()} 
                className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/10' : 'border-border'
                }`}
              >
                <input {...getInputProps()} />
                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Click to change or drag another file
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">Drag & drop an image here, or click to select</p>
                    <p className="text-sm text-muted-foreground">
                      Supports JPG, PNG, DICOM
                    </p>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleAnalyze}
                disabled={!selectedFile || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : 'Analyze Image'}
              </Button>
            </CardContent>
          </Card>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <span className={`text-sm font-medium ${
                      results.status === 'success' ? 'text-green-500' : 'text-amber-500'
                    }`}>
                      {results.status === 'success' ? 'Completed' : 'Warning'}
                    </span>
                  </div>
                  
                  {results.analysis_type && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Analysis Type</span>
                      <span className="text-sm">
                        {ANALYSIS_TYPES.find(t => t.id === results.analysis_type.split('_')[0])?.label || results.analysis_type}
                      </span>
                    </div>
                  )}
                </div>
                
                {results.findings && Object.entries(results.findings).map(([key, value]) => {
                  if (typeof value === 'boolean') {
                    return (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        {value ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    );
                  }
                  
                  if (key === 'confidence') {
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Confidence</span>
                          <span className="text-sm font-medium">{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    );
                  }
                  
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                      <span className="text-sm">
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right panel - Image viewer */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Image Viewer</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleZoomIn}
                    disabled={scale >= 3}
                  >
                    <ZoomIn className="h-4 w-4 mr-1" /> Zoom In
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleZoomOut}
                    disabled={scale <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4 mr-1" /> Zoom Out
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleResetView}
                    disabled={scale === 1 && position.x === 0 && position.y === 0}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" /> Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="relative w-full h-[500px] bg-black/5 dark:bg-white/5 rounded-md overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {preview ? (
                  <img
                    src={results?.visualization?.overlay || preview}
                    alt="Preview"
                    className={`absolute max-w-none transition-transform duration-200 ${
                      scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                    }`}
                    style={{
                      transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                      transformOrigin: 'center',
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No image selected
                  </div>
                )}
              </div>
              
              {results?.visualization?.bounding_boxes && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Detected Regions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {results.visualization.bounding_boxes.map((box, index) => (
                      <div key={index} className="text-xs p-2 border rounded">
                        <div>Region {index + 1}</div>
                        <div>X: {box[0]}, Y: {box[1]}</div>
                        <div>W: {box[2]}, H: {box[3]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {results?.findings?.suggestions && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {results.findings.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm">{suggestion}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedImageAnalysis;
