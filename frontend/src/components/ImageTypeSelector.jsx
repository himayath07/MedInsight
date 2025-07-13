import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, Heart, Eye, Bone, ScanHeart, AudioWaveform, Droplets, LineChart } from 'lucide-react';

const imageTypes = [
  {
    id: 'mri_3d',
    name: 'Brain MRI',
    description: 'Brain tumor detection and volumetric analysis',
    icon: Brain,
    color: 'bg-purple-700',
    analysisType: 'brain_tumor'
  },
  {
    id: 'xray',
    name: 'X-Ray',
    description: 'Bone fracture detection and analysis',
    icon: Bone,
    color: 'bg-orange-500',
    analysisType: 'fracture'
  },
  {
    id: 'ct_chest',
    name: 'Chest CT',
    description: 'Lung nodule detection and analysis',
    icon: ScanHeart,
    color: 'bg-blue-500',
    analysisType: 'lung_nodule'
  },
  {
    id: 'retinal',
    name: 'Retinal Scan',
    description: 'Diabetic retinopathy and eye disease detection',
    icon: Eye,
    color: 'bg-yellow-500',
    analysisType: 'retinal'
  },
  {
    id: 'organ_abnormality',
    name: 'Organ Scan',
    description: 'Liver, kidney, and other organ abnormality detection',
    icon: Heart,
    color: 'bg-red-500',
    analysisType: 'organ'
  },
  {
    id: 'ultrasound',
    name: 'Ultrasound',
    description: 'Soft tissue and pregnancy imaging analysis',
    icon: AudioWaveform,
    color: 'bg-green-500',
    analysisType: 'ultrasound'
  },
  {
    id: 'blood_sugar',
    name: 'Blood Sugar',
    description: 'Glucose level analysis and trends',
    icon: LineChart,
    color: 'bg-pink-500',
    analysisType: 'blood_sugar'
  },
];



const ImageTypeSelector = ({ selectedImageType, setSelectedImageType, setAnalysisType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {imageTypes.map((type) => {
        const IconComponent = type.icon;
        const isSelected = selectedImageType === type.id;

        return (
          <Card
            key={type.id}
            onClick={() => {
              setSelectedImageType(type.id);
              setAnalysisType && setAnalysisType(type.analysisType);
            }}
            className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-lg ${
              isSelected ? 'border-blue-500 ' : 'border-transparent hover:border-slate-200'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-lg ${type.color} text-white mb-3`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                {isSelected && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    Selected
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{type.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-slate-600">
                {type.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="pt-0">
              <p className="text-xs text-slate-500">
                {isSelected ? 'Currently selected' : 'Click to select'}
              </p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default ImageTypeSelector;
