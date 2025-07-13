import cv2
import numpy as np
from typing import Dict, List, Tuple, Optional
import torch
from torchvision import transforms
from PIL import Image
import io

class MedicalImageAnalyzer:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
    def analyze_image(self, image_data: bytes, analysis_type: str) -> Dict:
        """
        Main method to analyze medical images based on the specified analysis type.
        
        Args:
            image_data: Binary image data
            analysis_type: Type of analysis to perform (fracture, lung_nodule, brain_tumor, retinal, organ)
            
        Returns:
            Dictionary containing analysis results
        """
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if analysis_type == 'fracture':
                return self._detect_fractures(img)
            elif analysis_type == 'lung_nodule':
                return self._detect_lung_nodules(img)
            elif analysis_type == 'brain_tumor':
                return self._detect_brain_tumors(img)
            elif analysis_type == 'retinal':
                return self._analyze_retinal(img)
            elif analysis_type == 'organ':
                return self._detect_organ_abnormalities(img)
            else:
                raise ValueError(f"Unsupported analysis type: {analysis_type}")
                
        except Exception as e:
            return {"error": str(e), "status": "error"}
    
    def _detect_fractures(self, image: np.ndarray) -> Dict:
        """Detect bone fractures using edge detection and segmentation."""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Edge detection
        edges = cv2.Canny(gray, 50, 150, apertureSize=3)
        
        # Find contours
        contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        # Filter contours to find potential fractures
        fracture_contours = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if 100 < area < 5000:  # Adjust these values based on your needs
                fracture_contours.append(contour)
        
        # Create overlay
        overlay = image.copy()
        cv2.drawContours(overlay, fracture_contours, -1, (0, 0, 255), 2)
        
        # Convert overlay to base64 for frontend
        _, buffer = cv2.imencode('.png', overlay)
        overlay_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "status": "success",
            "analysis_type": "fracture_detection",
            "findings": {
                "fracture_detected": len(fracture_contours) > 0,
                "number_of_fractures": len(fracture_contours),
                "confidence": min(99, len(fracture_contours) * 20)  # Simple confidence metric
            },
            "visualization": {
                "overlay": f"data:image/png;base64,{overlay_base64}",
                "original_size": image.shape[:2],
                "bounding_boxes": [cv2.boundingRect(c) for c in fracture_contours]
            }
        }
    
    def _detect_lung_nodules(self, image: np.ndarray) -> Dict:
        """Detect lung nodules in chest CT scans."""
        # Placeholder for actual model inference
        # In a real implementation, you would load a pre-trained model here
        
        # For demonstration, we'll use simple blob detection
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Simple blob detector
        params = cv2.SimpleBlobDetector_Params()
        params.filterByArea = True
        params.minArea = 10
        params.maxArea = 1000
        detector = cv2.SimpleBlobDetector_create(params)
        keypoints = detector.detect(gray)
        
        # Create overlay
        overlay = cv2.drawKeypoints(image, keypoints, np.array([]), (0, 0, 255),
                                  cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
        
        _, buffer = cv2.imencode('.png', overlay)
        overlay_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "status": "success",
            "analysis_type": "lung_nodule_detection",
            "findings": {
                "nodules_detected": len(keypoints) > 0,
                "number_of_nodules": len(keypoints),
                "average_size": np.mean([k.size for k in keypoints]) if keypoints else 0,
                "confidence": min(95, len(keypoints) * 15)  # Simple confidence metric
            },
            "visualization": {
                "overlay": f"data:image/png;base64,{overlay_base64}",
                "original_size": image.shape[:2],
                "nodule_locations": [{'x': int(k.pt[0]), 'y': int(k.pt[1]), 'size': k.size} 
                                   for k in keypoints]
            }
        }
    
    def _detect_brain_tumors(self, image: np.ndarray) -> Dict:
        """Detect and segment brain tumors in MRI scans."""
        # Placeholder for actual model inference
        # In a real implementation, you would use a pre-trained segmentation model
        
        # Simple thresholding for demonstration
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Find contours
        contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        # Filter contours by size
        tumor_contours = [c for c in contours if 50 < cv2.contourArea(c) < 10000]
        
        # Create overlay
        overlay = image.copy()
        cv2.drawContours(overlay, tumor_contours, -1, (0, 255, 0), 2)
        
        # Calculate tumor area percentage
        total_area = image.shape[0] * image.shape[1]
        tumor_area = sum(cv2.contourArea(c) for c in tumor_contours)
        tumor_percentage = (tumor_area / total_area) * 100
        
        _, buffer = cv2.imencode('.png', overlay)
        overlay_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "status": "success",
            "analysis_type": "brain_tumor_detection",
            "findings": {
                "tumor_detected": len(tumor_contours) > 0,
                "number_of_tumors": len(tumor_contours),
                "tumor_area_percentage": round(tumor_percentage, 2),
                "confidence": min(95, len(tumor_contours) * 20)  # Simple confidence metric
            },
            "visualization": {
                "overlay": f"data:image/png;base64,{overlay_base64}",
                "original_size": image.shape[:2],
                "tumor_regions": [cv2.boundingRect(c) for c in tumor_contours]
            }
        }
    
    def _analyze_retinal(self, image: np.ndarray) -> Dict:
        """Analyze retinal images for diseases like diabetic retinopathy."""
        # Placeholder for actual model inference
        # In a real implementation, you would use a pre-trained model
        
        # Simple color-based analysis for demonstration
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Define color ranges for different retinal features
        # These are just example ranges and would need to be calibrated
        red_lower = np.array([0, 100, 100])
        red_upper = np.array([10, 255, 255])
        
        # Create masks for different features
        red_mask = cv2.inRange(hsv, red_lower, red_upper)
        
        # Count red pixels (potential hemorrhages)
        red_pixels = cv2.countNonZero(red_mask)
        total_pixels = image.shape[0] * image.shape[1]
        red_percentage = (red_pixels / total_pixels) * 100
        
        # Create overlay
        overlay = image.copy()
        overlay[red_mask > 0] = [0, 0, 255]  # Highlight in red
        
        _, buffer = cv2.imencode('.png', overlay)
        overlay_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "status": "success",
            "analysis_type": "retinal_analysis",
            "findings": {
                "abnormalities_detected": red_percentage > 0.1,
                "hemorrhage_percentage": round(red_percentage, 2),
                "confidence": min(95, red_percentage * 5)  # Simple confidence metric
            },
            "visualization": {
                "overlay": f"data:image/png;base64,{overlay_base64}",
                "original_size": image.shape[:2]
            }
        }
    
    def _detect_organ_abnormalities(self, image: np.ndarray) -> Dict:
        """Detect abnormalities in organ images (liver, kidney, etc.)."""
        # Placeholder for actual model inference
        # In a real implementation, you would use organ-specific models
        
        # Simple edge detection for demonstration
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 100, 200)
        
        # Count edge pixels as a simple abnormality indicator
        edge_pixels = cv2.countNonZero(edges)
        total_pixels = image.shape[0] * image.shape[1]
        edge_percentage = (edge_pixels / total_pixels) * 100
        
        # Create overlay
        overlay = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
        overlay = cv2.addWeighted(image, 0.7, overlay, 0.3, 0)
        
        _, buffer = cv2.imencode('.png', overlay)
        overlay_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "status": "success",
            "analysis_type": "organ_abnormality_detection",
            "findings": {
                "abnormalities_detected": edge_percentage > 10,  # Threshold
                "abnormality_score": round(edge_percentage, 2),
                "confidence": min(95, edge_percentage)  # Simple confidence metric
            },
            "visualization": {
                "overlay": f"data:image/png;base64,{overlay_base64}",
                "original_size": image.shape[:2]
            }
        }
