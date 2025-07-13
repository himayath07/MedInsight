import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const topIndianCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Bhopal"
];

// Load and parse CSV data for diagnostic centres


// Format time to 12-hour format with AM/PM
const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  
  // Handle different time formats
  const time = timeString.includes(':') 
    ? timeString.trim() 
    : `${timeString.slice(0, 2)}:${timeString.slice(2)}`;
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes || '00'} ${ampm}`;
};

// Check if the center is currently open
const getCurrentStatus = (openingTime, closingTime) => {
  if (!openingTime || !closingTime) return 'Timing not available';
  
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  
  const [openHour, openMinute] = openingTime.includes(':') 
    ? openingTime.split(':').map(Number) 
    : [Number(openingTime.slice(0, 2)), Number(openingTime.slice(2) || 0)];
    
  const [closeHour, closeMinute] = closingTime.includes(':')
    ? closingTime.split(':').map(Number)
    : [Number(closingTime.slice(0, 2)), Number(closingTime.slice(2) || 0)];
  
  const currentTotalMinutes = currentHours * 60 + currentMinutes;
  const openTotalMinutes = openHour * 60 + (openMinute || 0);
  const closeTotalMinutes = closeHour * 60 + (closeMinute || 0);
  
  if (currentTotalMinutes >= openTotalMinutes && currentTotalMinutes <= closeTotalMinutes) {
    return 'Open Now';
  } else if (currentTotalMinutes < openTotalMinutes) {
    return `Opens at ${formatTime(openingTime)}`;
  } else {
    return `Opens tomorrow at ${formatTime(openingTime)}`;
  }
};

const DiagnosticCentres = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [allCentres, setAllCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Papa.parse("/diagnostic_centres.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setAllCentres(results.data);
        setLoading(false);
      },
      error: (err) => {
        setError("Failed to load diagnostic centres data.");
        setLoading(false);
      }
    });
  }, []);

  // Filter centres by selected city
  const centres = selectedCity
    ? allCentres.filter(c => c.City && c.City.toLowerCase() === selectedCity.toLowerCase())
    : [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-800 p-2 sm:p-4">
      <div className="text-center max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">Diagnostic Centres</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Explore and find diagnostic centres near you. Select a city to get started!
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full max-w-2xl">
        {topIndianCities.map(city => (
          <button
            key={city}
            className={`rounded-lg w-full px-4 py-2 font-semibold shadow-md transition-colors text-base sm:text-lg ${selectedCity === city ? 'bg-blue-600 text-white' : 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-100'}`}
            onClick={() => setSelectedCity(city)}
          >
            {city}
          </button>
        ))}
      </div>
      {loading && (
        <div className="mt-8 text-blue-600 text-lg">Loading diagnostic centres...</div>
      )}
      {error && (
        <div className="mt-8 text-red-600 text-lg">{error}</div>
      )}
      {selectedCity && !loading && !error && (
        <div className="mt-12 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-200 mb-4 text-center">Top Diagnostic Centres in {selectedCity}</h2>
          {centres.length === 0 ? (
            <div className="text-center text-gray-500">No centres found for this city.</div>
          ) : (
            <div className="space-y-6">
              {centres.slice(0, 10).map((centre, idx) => (
                <div key={idx} className="rounded-xl bg-white dark:bg-zinc-900 shadow-lg p-6 border border-blue-100 dark:border-blue-900">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <div>
                      <div className="text-xl font-bold text-blue-800 dark:text-blue-200">{centre["Centre Name"]}</div>
                      <div className="text-gray-600 dark:text-gray-300 text-sm">{centre["Location"]}</div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{centre["Mobile Number"]}</div>
                  </div>
                  <div className="text-gray-700 dark:text-gray-200 mb-1"><span className="font-semibold">Address:</span> {centre["Address"]}</div>
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className="font-semibold">Services:</span>
                    {(centre["Services"] || "").split(",").map((s, i) => (
                      <span key={i} className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-100 rounded px-2 py-0.5 text-xs font-medium">{s.trim()}</span>
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">Timings:</span>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {getCurrentStatus(centre["Opening Time"], centre["Closing Time"])}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2">
                        <div className="font-medium text-blue-700 dark:text-blue-300">Open Hours</div>
                        <div className="text-gray-700 dark:text-gray-300">
                          {formatTime(centre["Opening Time"])} - {formatTime(centre["Closing Time"])}
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2">
                        <div className="font-medium text-blue-700 dark:text-blue-300">Days Open</div>
                        <div className="text-gray-700 dark:text-gray-300">
                          {centre["Working Days"] || 'Monday - Sunday'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticCentres;
