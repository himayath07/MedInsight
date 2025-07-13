import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { AlertCircle, CheckCircle, XCircle, AlertTriangle, Info, Loader2, Image as ImageIcon } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"

// Sample data structure for testing
const sampleResults = {
  analysis_type: 'brain_mri',
  confidence: 0.87,
  findings: [
    { 
      description: 'Tumor detected in the left frontal lobe', 
      severity: 'high',
      location: 'Left frontal lobe'
    },
    { 
      description: 'Mild swelling detected', 
      severity: 'medium',
      location: 'Right parietal lobe'
    },
    { 
      description: 'Normal vascular structure', 
      severity: 'low'
    }
  ],
  recommendations: [
    'Consult a neurologist for further evaluation',
    'Schedule a follow-up MRI in 3 months',
    'Consider additional tests for tumor characterization'
  ],
  overlay_image: null, // This would be a base64 string in real usage
  metrics: {
    tumor_size: '2.5cm',
    confidence_score: 87,
    risk_level: 'High',
    comparison: 'Increased from previous scan'
  }
};

const EnhancedAnalysisResults = ({ results = sampleResults }) => {
  // Log results for debugging
  useEffect(() => {
    console.log('Analysis Results:', results);
  }, [results]);

  if (!results) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  // Format the analysis type for display
  const formatAnalysisType = (type) => {
    if (!type) return 'Analysis';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Destructure results with default values
  const { 
    analysis_type, 
    confidence = 0, 
    findings = [], 
    recommendations = [],
    overlay_image,
    metrics = {}
  } = results;

  // Check for critical findings
  const hasCriticalFindings = findings.some(f => f.severity === 'high');
  const criticalFindings = findings.filter(f => f.severity === 'high');



  return (
    <div className="space-y-6 p-4">
      {/* Critical Alerts */}
      {hasCriticalFindings && (
        <Alert variant="destructive" className="animate-pulse border-red-300">
          <AlertTriangle className="h-5 w-5" />
          <div className="ml-2">
            <AlertTitle className="text-base">Critical Finding Detected</AlertTitle>
            <AlertDescription>
              {criticalFindings[0]?.description || 'Please consult a healthcare professional immediately.'}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <h2 className="text-2xl font-bold text-slate-800">Analysis Results</h2>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl">{formatAnalysisType(analysis_type || 'analysis')}</CardTitle>
              <CardDescription>Detailed analysis of your medical image</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Confidence Score */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">Confidence Score</h3>
                <div className="flex items-center gap-4">
                  <Progress value={(confidence || 0) * 100} className="h-2.5 flex-1" />
                  <span className="text-sm font-medium text-slate-900 min-w-[50px]">
                    {Math.round((confidence || 0) * 100)}%
                  </span>
                </div>
              </div>

              {/* Findings */}
              {findings.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Key Findings</h3>
                  <div className="space-y-3">
                    {findings.map((finding, index) => (
                      <Alert 
                        key={index} 
                        variant={
                          finding.severity === 'high' ? 'destructive' : 
                          finding.severity === 'medium' ? 'warning' : 'default'
                        }
                        className="items-start"
                      >
                        {finding.severity === 'high' ? (
                          <XCircle className="h-5 w-5 mt-0.5" />
                        ) : finding.severity === 'medium' ? (
                          <AlertCircle className="h-5 w-5 mt-0.5" />
                        ) : (
                          <Info className="h-5 w-5 mt-0.5" />
                        )}
                        <div className="ml-2">
                          <AlertTitle className="capitalize">
                            {finding.severity} Finding{finding.location ? ` in ${finding.location}` : ''}
                          </AlertTitle>
                          <AlertDescription className="mt-1">
                            {finding.description}
                          </AlertDescription>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert>
                  <Info className="h-5 w-5" />
                  <AlertDescription>No significant findings detected.</AlertDescription>
                </Alert>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Recommendations</h3>
                  <div className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization">
          <Card>
            <CardHeader>
              <CardTitle>Visual Analysis</CardTitle>
              <CardDescription>Interactive visualization of the analysis results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {overlay_image ? (
                <>
                  <div className="border rounded-lg overflow-hidden bg-black/5 p-4">
                    <div className="relative w-full h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
                      <img 
                        src={`data:image/png;base64,${overlay_image}`} 
                        alt="Analysis overlay"
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWltYWdlLW9mZiI+CiAgPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjIiLz4KICA8cGF0aCBkPSJNMTguOTkgMTguOTlhMiAxIDAgMCAxLTEuNDEuMjlIMy41M0EyLjAxIDIuMDEgMCAwIDEgMiAxNy4wMlI0IDE0bDIuMzgtMy40NmMuMi0uMjcuMzYtLjU5LjQ0LS45Nk04IDE2aC4wMSIvPgogIDxwYXRoIGQ9Im0xNCAxNCAxMiAxMiIvPgogIDxwYXRoIGQ9Ik0xOCA4aC4wMSIvPgogIDxwYXRoIGQ9Ik0xOCAyaDQuNjRjLjI2IDAgLjQ4LjE1LjU5LjM3bC45MSAxLjYzYy4wNy4xMy4xLjI3LjEuNDNWMTlhMiAyIDAgMCAxLTIgMmgtMTMiLz4KICA8cGF0aCBkPSJtMiA5IDMuNTctMy41N0MuNiA0LjkgMi4wNSA0IDMuNzcgNGguMDFDNS41OSA0IDcuMTEgNS4yNSA3LjM0IDdIMTJjLjU1IDAgMSAuNDUgMSAxIi8+CiAgPHBhdGggZD0ibTIgMiAyMCAyMCIvPgo8L3N2Zz4=';
                          }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-md">
                        <div className="text-center p-4 bg-white/90 rounded-lg shadow-lg">
                          <p className="font-medium text-slate-700">Sample Medical Scan</p>
                          <p className="text-sm text-slate-500 mt-1">This is a placeholder for the actual scan visualization</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 p-2 bg-slate-50 rounded">
                      <Info className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      <span>Red areas indicate potential abnormalities. Hover over the image to zoom.</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-500 border-2 border-dashed rounded-lg">
                  <ImageIcon className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                  <p className="font-medium">No visualization available</p>
                  <p className="text-sm mt-1">This analysis does not include visual results.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Metrics</CardTitle>
              <CardDescription>Quantitative analysis results</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(metrics).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          {key.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                        <span className="font-mono">
                          {typeof value === 'number' ? value.toLocaleString() : value}
                        </span>
                      </div>
                      {typeof value === 'number' && (
                        <Progress 
                          value={value <= 100 ? value : 100} 
                          className="h-2" 
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 border-2 border-dashed rounded-lg">
                  <span className="text-sm">No metrics available for this analysis</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalysisResults;
