from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

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
    },
    {
        "id": 3,
        "name": "Dr. Amit Patel",
        "specialty": "Orthopedic",
        "location": "New Delhi",
        "phone": "+91 98765 67890",
        "lat": 28.6139,
        "lng": 77.2295,
        "rating": 4.9,
        "experience": 15,
        "image_url": "https://img.icons8.com/color/96/000000/doctor-male--v1.png"
    },
    {
        "id": 4,
        "name": "Dr. Anjali Mehta",
        "specialty": "Dermatologist",
        "location": "New Delhi",
        "phone": "+91 98765 11111",
        "lat": 28.6208,
        "lng": 77.2362,
        "rating": 4.6,
        "experience": 8,
        "image_url": "https://img.icons8.com/color/96/000000/doctor-male--v1.png"
    },
    {
        "id": 5,
        "name": "Dr. Ramesh Iyer",
        "specialty": "Pediatrician",
        "location": "New Delhi",
        "phone": "+91 98765 22222",
        "lat": 28.6256,
        "lng": 77.2273,
        "rating": 4.7,
        "experience": 11,
        "image_url": "https://img.icons8.com/color/96/000000/doctor-male--v1.png"
    }
]

@app.route('/')
def home():
    return jsonify({"message": "Medical Assistant API is running!"})

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    try:
        location = request.args.get('location', 'New Delhi').lower()
        specialty = request.args.get('specialty', '').lower()
        
        filtered_doctors = mock_doctors
        
        # Filter by location if provided
        if location:
            filtered_doctors = [doc for doc in filtered_doctors if location in doc["location"].lower()]
        
        # Filter by specialty if provided
        if specialty:
            filtered_doctors = [doc for doc in filtered_doctors if specialty in doc["specialty"].lower()]
        
        # Shuffle the results for variety
        random.shuffle(filtered_doctors)
        
        return jsonify(filtered_doctors)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server on http://127.0.0.1:5000")
    print("Available endpoints:")
    print("- GET /: Health check")
    print("- GET /api/doctors: Search doctors by location and specialty")
    app.run(host='0.0.0.0', port=5000, debug=True)
