from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from typing import List, Optional
import random

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Doctor(BaseModel):
    id: int
    name: str
    specialty: str
    location: str
    phone: str
    lat: float
    lng: float
    rating: float
    experience: int
    image_url: Optional[str] = "https://img.icons8.com/color/96/000000/doctor-male--v1.png"

# Mock data for doctors
mock_doctors = [
    {
        "id": 1,
        "name": "Dr. Rajesh Kumar",
        "specialty": "Cardiologist",
        "location": "New Delhi",
        "phone": "+91 98765 43210",
        "lat": 28.6139,
        "lng": 77.2090,
        "rating": 4.8,
        "experience": 12,
        "image_url": "https://img.icons8.com/color/96/000000/doctor-male--v1.png"
    },
    {
        "id": 2,
        "name": "Dr. Priya Sharma",
        "specialty": "Neurologist",
        "location": "New Delhi",
        "phone": "+91 98765 12345",
        "lat": 28.6274,
        "lng": 77.2167,
        "rating": 4.7,
        "experience": 10,
        "image_url": "https://img.icons8.com/color/96/000000/doctor-male--v1.png"
    }
]

@app.get("/")
async def root():
    return {"message": "Medical Assistant API is running!"}

@app.get("/api/doctors")
async def get_doctors(location: str = "New Delhi", specialty: str = ""):
    try:
        filtered_doctors = mock_doctors
        
        # Filter by location if provided
        if location:
            filtered_doctors = [doc for doc in filtered_doctors if location.lower() in doc["location"].lower()]
        
        # Filter by specialty if provided
        if specialty:
            filtered_doctors = [doc for doc in filtered_doctors if specialty.lower() in doc["specialty"].lower()]
        
        return filtered_doctors
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("Starting server on http://127.0.0.1:5001")
    print("Available endpoints:")
    print("- GET /: Health check")
    print("- GET /api/doctors: Search doctors by location and specialty")
    uvicorn.run(app, host="127.0.0.1", port=5001, log_level="info")
