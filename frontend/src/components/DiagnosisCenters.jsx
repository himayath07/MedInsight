import React, { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, Star, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

const DiagnosisCenters = () => {
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [centers, setCenters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Mock data for diagnosis centers with coordinates
  // List of top Indian cities with their coordinates
  const topIndianCities = [
    { name: 'Mumbai', coords: { lat: 19.0760, lng: 72.8777 } },
    { name: 'Delhi', coords: { lat: 28.6139, lng: 77.2090 } },
    { name: 'Bangalore', coords: { lat: 12.9716, lng: 77.5946 } },
    { name: 'Hyderabad', coords: { lat: 17.3850, lng: 78.4867 } },
    { name: 'Chennai', coords: { lat: 13.0827, lng: 80.2707 } },
    { name: 'Kolkata', coords: { lat: 22.5726, lng: 88.3639 } },
    { name: 'Pune', coords: { lat: 18.5204, lng: 73.8567 } },
    { name: 'Ahmedabad', coords: { lat: 23.0225, lng: 72.5714 } },
    { name: 'Jaipur', coords: { lat: 26.9124, lng: 75.7873 } },
    { name: 'Lucknow', coords: { lat: 26.8467, lng: 80.9462 } },
    { name: 'Chandigarh', coords: { lat: 30.7333, lng: 76.7794 } },
    { name: 'Bhopal', coords: { lat: 23.2599, lng: 77.4126 } }
  ];

  const mockCenters = [
    {
      id: 1,
      name: 'City Health Diagnostics',
      address: '123 Medical Center Dr, Cityville',
      coordinates: { lat: 12.9716, lng: 77.5946 }, // Example coordinates (Bangalore)
      rating: 4.7,
      openNow: true,
      phone: '(555) 123-4567',
      hours: 'Open 24/7',
      services: ['X-Ray', 'MRI', 'Blood Tests', 'Ultrasound']
    },
    {
      id: 2,
      name: 'Metro Diagnostic Labs',
      address: '456 Health St, Townsville',
      coordinates: { lat: 12.9344, lng: 77.6124 },
      rating: 4.5,
      openNow: true,
      phone: '(555) 987-6543',
      hours: 'Mon-Fri: 7:00 AM - 9:00 PM',
      services: ['CT Scan', 'Mammography', 'Blood Tests']
    },
    {
      id: 3,
      name: 'Precision Diagnostics',
      address: '789 Wellness Ave, Villageton',
      coordinates: { lat: 12.9850, lng: 77.5500 },
      rating: 4.3,
      openNow: false,
      phone: '(555) 456-7890',
      hours: 'Mon-Sun: 8:00 AM - 8:00 PM',
      services: ['MRI', 'Ultrasound', 'EKG', 'Lab Tests']
    },
    {
      id: 4,
      name: 'Rapid Test Labs',
      address: '321 Hospital Rd, Meditown',
      coordinates: { lat: 12.9500, lng: 77.6300 },
      rating: 4.1,
      openNow: true,
      phone: '(555) 234-5678',
      hours: 'Open 24/7',
      services: ['COVID Testing', 'Blood Tests', 'Urgent Care']
    },
    {
      id: 5,
      name: 'Advanced Imaging Center',
      address: '159 Diagnostic Way, Scantown',
      coordinates: { lat: 12.9100, lng: 77.6500 },
      rating: 4.6,
      openNow: true,
      phone: '(555) 876-5432',
      hours: 'Mon-Fri: 6:00 AM - 10:00 PM',
      services: ['MRI', 'CT Scan', 'X-Ray', 'Mammography']
    }
  ];

  // Function to calculate distance between two coordinates in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  };

  // Function to get coordinates from location name (mock implementation)
  const getCoordinatesFromLocation = async (location) => {
    console.log('Getting coordinates for location:', location);
    
    // In a real app, you would call a geocoding API here
    // This is a mock implementation that returns a fixed location for demonstration
    const mockLocations = {
      'bangalore': { lat: 12.9716, lng: 77.5946 },
      'mumbai': { lat: 19.0760, lng: 72.8777 },
      'delhi': { lat: 28.6139, lng: 77.2090 },
      'chennai': { lat: 13.0827, lng: 80.2707 },
      'kolkata': { lat: 22.5726, lng: 88.3639 },
      'hyderabad': { lat: 17.3850, lng: 78.4867 },
      'current location': { lat: 12.9716, lng: 77.5946 } // Handle 'Current Location' text
    };

    const normalizedLocation = location.toLowerCase().trim();
    const coords = mockLocations[normalizedLocation] || mockLocations['bangalore'];
    console.log('Returning coordinates:', coords);
    return coords;
  };

  // Enhanced search for center by service and city
  const handleFindCenters = async () => {
    const locationText = location.trim();
    const serviceText = service.trim().toLowerCase();
    setIsLoading(true);
    try {
      let results = [];
      let searchCities = [];
      let cityCoords = null;
      if (locationText) {
        cityCoords = await getCoordinatesFromLocation(locationText);
        searchCities = [{ name: locationText, coords: cityCoords }];
      } else {
        // If no city, use top 5 cities
        searchCities = topIndianCities.slice(0, 5);
      }
      // Try each city in order until results are found
      for (let city of searchCities) {
        const coords = city.coords;
        // Calculate distances for all centers in mockCenters
        let centersWithDistance = mockCenters.map(center => {
          const distance = calculateDistance(
            coords.lat, coords.lng,
            center.coordinates.lat, center.coordinates.lng
          );
          return {
            ...center,
            distance: distance.toFixed(1) + ' km',
            distanceValue: distance
          };
        });
        // Filter by service if specified
        if (serviceText) {
          centersWithDistance = centersWithDistance.filter(center =>
            center.services.some(s => s.toLowerCase().includes(serviceText))
          );
        }
        // Sort by distance and take top 10
        centersWithDistance = centersWithDistance.sort((a, b) => a.distanceValue - b.distanceValue).slice(0, 10);
        if (centersWithDistance.length > 0) {
          results = centersWithDistance;
          setLocation(city.name); // Update location if searching top cities
          break;
        }
      }
      setCenters(results);
      if (results.length === 0) {
        alert('No diagnostic centers found for the requested service in the selected or top cities.');
      }
    } catch (error) {
      console.error('Error finding centers:', error);
      alert('Error finding centers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      try {
        console.log('Requesting geolocation...');
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });
        
        console.log('Got geolocation:', position);
        
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        console.log('Setting user location to:', userCoords);
        setUserLocation(userCoords);
        setLocation('Current Location');
        
        // Calculate distances and sort centers
        const centersWithDistance = mockCenters.map(center => {
          const distance = calculateDistance(
            userCoords.lat, 
            userCoords.lng, 
            center.coordinates.lat, 
            center.coordinates.lng
          );
          
          console.log(`Center: ${center.name}, Distance: ${distance.toFixed(2)} km`);
          
          return {
            ...center,
            distance: distance.toFixed(1) + ' km',
            distanceValue: distance // For sorting
          };
        });
        
        // Sort by distance and take top 10
        const sortedCenters = centersWithDistance
          .sort((a, b) => a.distanceValue - b.distanceValue)
          .slice(0, 10);
        
        console.log('Sorted centers:', sortedCenters);
        setCenters(sortedCenters);
      } catch (error) {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please enter your location manually.');
      }
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Function to handle directions
  const handleGetDirections = (destination) => {
    // In a real app, this would open the user's preferred maps app
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination.coordinates.lat},${destination.coordinates.lng}`;
    window.open(mapsUrl, '_blank');
  };

  // Debug function to check current state
  const debugState = () => {
    console.log('Current State:', {
      location,
      userLocation,
      centers: centers.map(c => ({
        name: c.name,
        distance: c.distance,
        coords: c.coordinates
      }))
    });
    alert('Check console for debug information');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-end mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={debugState}
          className="text-xs"
        >
          Debug Info
        </Button>
      </div>
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-t-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Find Nearest Diagnosis Centers
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {userLocation 
                  ? `Showing centers near your current location` 
                  : location 
                    ? `Showing centers near ${location}` 
                    : 'Enter your location to find nearby centers'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter your location or use current location"
                className="pl-10 h-12 text-base mb-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Enter test/service (e.g., MRI, Blood Test)"
                className="pl-3 h-12 text-base mb-2"
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 self-center">Popular cities:</span>
                {topIndianCities.slice(0, 5).map((city, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setLocation(city.name);
                      setUserLocation(city.coords);
                      setTimeout(handleFindCenters, 100);
                    }}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {city.name}
                  </button>
                ))}
                {topIndianCities.length > 5 && (
                  <div className="relative group">
                    <button
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      More...
                    </button>
                    <div className="absolute z-10 hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 w-48 mt-1">
                      <div className="grid grid-cols-2 gap-1">
                        {topIndianCities.slice(5).map((city, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setLocation(city.name);
                              setUserLocation(city.coords);
                              setTimeout(handleFindCenters, 100);
                            }}
                            className="text-xs px-2 py-1 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                          >
                            {city.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Button 
              onClick={handleFindCenters}
              disabled={!location.trim() || isLoading}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading ? 'Searching...' : 'Find Centers'}
            </Button>
            <Button 
              variant="outline" 
              onClick={getCurrentLocation}
              disabled={isLoading}
              className="h-12"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Use My Location
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : centers.length > 0 ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Nearby Diagnosis Centers
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {centers.map((center) => (
                  <Card key={center.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {center.name}
                        </h4>
                        <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md text-sm">
                          <Star className="h-4 w-4 mr-1 fill-current" />
                          {center.rating}
                        </div>
                      </div>
                    
                    <div className="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span>{center.address}</span>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Clock className={`h-4 w-4 mr-1.5 flex-shrink-0 ${center.openNow ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={center.openNow ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {center.openNow ? 'Open Now' : 'Closed'}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{center.hours}</span>
                    </div>
                    
                    <div className="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-400">
                      <Phone className="h-4 w-4 mr-1.5" />
                      <a href={`tel:${center.phone}`} className="hover:underline">
                        {center.phone}
                      </a>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Services:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {center.services.map((service, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-5 flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {center.distance} away
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleGetDirections(center)}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Directions
                      </Button>
                    </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No diagnosis centers found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Try adjusting your search or use your current location
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosisCenters;
