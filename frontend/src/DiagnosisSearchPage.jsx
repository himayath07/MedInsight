import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Stethoscope, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Download,
  Plus,
  X,
  Thermometer,
  Calendar,
  Clock3
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';

const DiagnosisSearchPage = () => {
  const [symptoms, setSymptoms] = useState('');
  const [symptomList, setSymptomList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('symptoms');
  const [severity, setSeverity] = useState('moderate');
  const [duration, setDuration] = useState('1-3 days');
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('diagnosisHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save to search history when a diagnosis is made
  const saveToHistory = (symptoms, result) => {
    const newHistory = [
      {
        id: Date.now(),
        date: new Date().toISOString(),
        symptoms: symptoms,
        condition: result.name,
        severity,
        duration
      },
      ...searchHistory
    ].slice(0, 10); // Keep only last 10 searches
    
    setSearchHistory(newHistory);
    localStorage.setItem('diagnosisHistory', JSON.stringify(newHistory));
  };

  const commonSymptoms = [
    'Headache',
    'Fever',
    'Cough',
    'Fatigue',
    'Dizziness',
    'Nausea',
    'Sore throat',
    'Shortness of breath',
    'Chest pain',
    'Abdominal pain',
    'Diarrhea',
    'Muscle aches',
    'Joint pain',
    'Rash',
    'Dizziness',
    'Loss of appetite',
    'Heartburn',
    'Back pain',
    'Difficulty sleeping',
    'Frequent urination'
  ];

  const getConditionForSymptom = (symptom) => {
    const symptomLower = symptom.toLowerCase();
    
    // Common conditions mapped to symptoms
    const conditions = {
      'headache': {
        name: 'Tension Headache',
        probability: 'High',
        description: 'A common headache often associated with stress, muscle tension, or fatigue.',
        recommendations: [
          'Rest in a quiet, dark room',
          'Apply a warm or cold compress to your head/neck',
          'Practice relaxation techniques',
          'Stay hydrated',
          'Consider over-the-counter pain relievers',
          'See a doctor if severe or persistent'
        ],
        suggestedTests: [
          { name: 'Blood Pressure Measurement', reason: 'To check for hypertension' },
          { name: 'Complete Blood Count (CBC)', reason: 'To check for infections or anemia' },
          { name: 'CT Scan or MRI', reason: 'If severe or persistent, to rule out serious conditions' }
        ]
      },
      'fever': {
        name: 'Viral Infection',
        probability: 'High',
        description: 'Elevated body temperature often indicating your body is fighting an infection.',
        recommendations: [
          'Get plenty of rest',
          'Stay hydrated',
          'Use fever-reducing medication (if needed)',
          'Take a lukewarm bath',
          'Wear lightweight clothing',
          'Seek medical attention if fever is above 39.4°C (103°F) or lasts more than 3 days'
        ],
        suggestedTests: [
          { name: 'Complete Blood Count (CBC)', reason: 'To check for infection or inflammation' },
          { name: 'Urinalysis', reason: 'To check for urinary tract infection' },
          { name: 'Chest X-ray', reason: 'If respiratory symptoms are present' },
          { name: 'Blood Culture', reason: 'If infection source is unclear' }
        ]
      },
      'cough': {
        name: 'Acute Bronchitis',
        probability: 'Medium',
        description: 'Inflammation of the bronchial tubes often caused by a viral infection.',
        recommendations: [
          'Drink warm liquids',
          'Use a humidifier',
          'Try honey (for adults and children over 1 year)',
          'Use cough drops or lozenges',
          'Avoid irritants like smoke',
          'See a doctor if cough lasts more than 3 weeks'
        ],
        suggestedTests: [
          { name: 'Chest X-ray', reason: 'To rule out pneumonia or other lung conditions' },
          { name: 'Sputum Culture', reason: 'If bacterial infection is suspected' },
          { name: 'Pulmonary Function Test', reason: 'For persistent cough' },
          { name: 'Allergy Testing', reason: 'If allergies are suspected' }
        ]
      },
      'sore throat': {
        name: 'Pharyngitis',
        probability: 'High',
        description: 'Inflammation of the pharynx, typically causing a sore throat.',
        recommendations: [
          'Gargle with warm salt water',
          'Drink warm liquids',
          'Use throat lozenges',
          'Get plenty of rest',
          'Use a humidifier',
          'See a doctor if symptoms last more than a week'
        ],
        suggestedTests: [
          { name: 'Rapid Strep Test', reason: 'To check for streptococcal infection' },
          { name: 'Throat Culture', reason: 'If strep test is negative but symptoms persist' },
          { name: 'Mono Spot Test', reason: 'If mononucleosis is suspected' },
          { name: 'Complete Blood Count (CBC)', reason: 'To check for infection' }
        ]
      },
      'abdominal pain': {
        name: 'Gastroenteritis',
        probability: 'Medium',
        description: 'Inflammation of the stomach and intestines, typically resulting from a viral infection.',
        recommendations: [
          'Stay hydrated with clear fluids',
          'Follow the BRAT diet (bananas, rice, applesauce, toast)',
          'Avoid dairy, caffeine, and fatty foods',
          'Get plenty of rest',
          'Use anti-nausea medication if needed',
          'Seek medical attention if severe pain or symptoms persist'
        ],
        suggestedTests: [
          { name: 'Complete Blood Count (CBC)', reason: 'To check for infection or inflammation' },
          { name: 'Stool Test', reason: 'If diarrhea is present' },
          { name: 'Abdominal Ultrasound', reason: 'To check abdominal organs' },
          { name: 'Urine Test', reason: 'To rule out UTI or kidney stones' },
          { name: 'H. Pylori Test', reason: 'If stomach ulcer is suspected' }
        ]
      },
      'fatigue': {
        name: 'Possible Anemia or Sleep Disorder',
        probability: 'Medium',
        description: 'Persistent tiredness that may indicate various underlying conditions.',
        recommendations: [
          'Maintain a regular sleep schedule',
          'Exercise regularly',
          'Eat a balanced diet',
          'Stay hydrated',
          'Reduce stress',
          'Consult a doctor if fatigue is persistent'
        ],
        suggestedTests: [
          { name: 'Complete Blood Count (CBC)', reason: 'To check for anemia or infection' },
          { name: 'Thyroid Function Tests', reason: 'To check for hypothyroidism' },
          { name: 'Blood Glucose Test', reason: 'To check for diabetes' },
          { name: 'Vitamin D Level', reason: 'To check for deficiency' },
          { name: 'Electrolyte Panel', reason: 'To check for imbalances' },
          { name: 'Sleep Study', reason: 'If sleep disorder is suspected' }
        ]
      }
    };

    // Default condition if no specific match
    const defaultCondition = {
      name: 'General Medical Condition',
      probability: 'Low',
      description: 'Your symptoms may indicate a medical condition that requires evaluation.',
      recommendations: [
        'Monitor your symptoms',
        'Get plenty of rest',
        'Stay hydrated',
        'Consider over-the-counter symptom relief',
        'Keep a symptom diary',
        'Consult a healthcare professional for persistent or worsening symptoms'
      ],
      suggestedTests: [
        { name: 'Complete Blood Count (CBC)', reason: 'General health screening' },
        { name: 'Basic Metabolic Panel', reason: 'To check organ function' },
        { name: 'Urinalysis', reason: 'General health screening' },
        { name: 'Thyroid Function Test', reason: 'If fatigue or weight changes are present' }
      ]
    };

    // Find matching condition or return default
    const matchedSymptom = Object.keys(conditions).find(key => 
      symptomLower.includes(key) || key.includes(symptomLower)
    );

    return matchedSymptom ? conditions[matchedSymptom] : defaultCondition;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const symptomsText = symptoms.trim().toLowerCase();
    
    if (!symptomsText) {
      setError('Please enter symptoms to search');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get condition based on symptoms
      const condition = getConditionForSymptom(symptomsText);
      
      // Format the response with suggested tests from the condition
      const mockDiagnosis = {
        possibleConditions: [condition],
        suggestedTests: condition.suggestedTests || [
          { name: 'Complete Blood Count (CBC)', reason: 'General health screening' },
          { name: 'Urinalysis', reason: 'Check for infections' }
        ]
      };

      setDiagnosis(mockDiagnosis);
    } catch (err) {
      setError('Failed to get diagnosis. Please try again.');
      console.error('Diagnosis search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-t-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Symptom Checker
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Enter your symptoms to get a preliminary diagnosis
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Describe your symptoms in detail
              </label>
              <div className="relative">
                <Input
                  id="symptoms"
                  type="text"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="E.g., headache, fever, sore throat, etc."
                  className="pl-10 h-12 text-base"
                  disabled={isLoading}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                
                {showSuggestions && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                    <div className="p-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                      Common symptoms:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-1">
                      {commonSymptoms.map((symptom, index) => (
                        <button
                          key={index}
                          type="button"
                          className="text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                          onClick={() => {
                            setSymptoms(symptom.toLowerCase());
                            setShowSuggestions(false);
                            document.getElementById('symptoms').focus();
                          }}
                        >
                          {symptom}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" /> {error}
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find Possible Conditions
                </>
              )}
            </Button>
          </form>

          {diagnosis && (
            <div className="mt-8 space-y-8">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Possible Conditions
                </h3>
                <div className="space-y-6">
                  {diagnosis.possibleConditions.map((condition, index) => (
                    <Card key={index} className="border-l-4 border-blue-500">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              {condition.name}
                              <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                {condition.probability} probability
                              </span>
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {condition.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Recommendations:
                        </h4>
                        <ul className="space-y-1.5">
                          {condition.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {diagnosis.suggestedTests && diagnosis.suggestedTests.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Suggested Tests
                  </h3>
                  <div className="space-y-3">
                    {diagnosis.suggestedTests.map((test, index) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{test.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{test.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Important Note
                    </h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                      <p>
                        This tool is for informational purposes only and is not a substitute for professional medical advice. 
                        Always consult a healthcare provider for an accurate diagnosis and appropriate treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          
        </CardContent>
        
        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center w-full">
            This tool uses AI to provide potential diagnoses based on symptoms. Results are not a medical diagnosis.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DiagnosisSearchPage;
