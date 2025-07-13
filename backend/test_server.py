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
    Doctor(
        id=1,
        name="Dr. Rajesh Kumar",
        specialty="Cardiologist",
        location="New Delhi",
        phone="+91 98765 43210",
        lat=28.6139,
        lng=77.2090,
        rating=4.8,
        experience=12,
    ),
    Doctor(
        id=2,
        name="Dr. Priya Sharma",
        specialty="Neurologist",
        location="New Delhi",
        phone="+91 98765 12345",
        lat=28.6274,
        lng=77.2167,
        rating=4.7,
        experience=10,
    ),
    Doctor(
        id=3,
        name="Dr. Amit Patel",
        specialty="Orthopedic",
        location="New Delhi",
        phone="+91 98765 67890",
        lat=28.6139,
        lng=77.2295,
        rating=4.9,
        experience=15,
    ),
    Doctor(
        id=4,
        name="Dr. Anjali Mehta",
        specialty="Dermatologist",
        location="New Delhi",
        phone="+91 98765 11111",
        lat=28.6208,
        lng=77.2362,
        rating=4.6,
        experience=8,
    ),
    Doctor(
        id=5,
        name="Dr. Ramesh Iyer",
        specialty="Pediatrician",
        location="New Delhi",
        phone="+91 98765 22222",
        lat=28.6256,
        lng=77.2273,
        rating=4.7,
        experience=11,
    ),
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
            filtered_doctors = [doc for doc in filtered_doctors if location.lower() in doc.location.lower()]
        
        # Filter by specialty if provided
        if specialty:
            filtered_doctors = [doc for doc in filtered_doctors if specialty.lower() in doc.specialty.lower()]
        
        # Shuffle the results for variety
        random.shuffle(filtered_doctors)
        
        return filtered_doctors
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("Starting test server on http://127.0.0.1:5000")
    print("Available endpoints:")
    print("- GET /: Health check")
    print("- GET /api/doctors: Search doctors by location and specialty")
    uvicorn.run(app, host="0.0.0.0", port=5000)
