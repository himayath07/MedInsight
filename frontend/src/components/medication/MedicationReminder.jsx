import React, { useState, useEffect } from 'react';
import { Plus, Clock, Pencil, Trash2, Bell, Clock3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

// Simple date formatter to avoid external dependencies
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Main component
const MedicationReminder = () => {
  // --- Medication History State ---
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('medicationHistory');
    if (savedHistory) {
      setMedicationHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('medicationHistory', JSON.stringify(medicationHistory));
  }, [medicationHistory]);

  // Log an action to history
  const logMedicationAction = (medication, action) => {
    setMedicationHistory(prev => [
      {
        id: Date.now(),
        medId: medication.id,
        name: medication.name,
        action,
        time: new Date().toISOString(),
      },
      ...prev
    ]);
  };

  const [medications, setMedications] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  // Time selection state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState('08');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [amPm, setAmPm] = useState('AM');
  const [isFocused, setIsFocused] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time: '08:00 AM',
    days: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    isRecurring: true,
    startDate: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    endDate: '',
    notes: ''
  });

  // Load medications from localStorage on component mount
  useEffect(() => {
    const savedMeds = localStorage.getItem('medications');
    if (savedMeds) {
      setMedications(JSON.parse(savedMeds));
    }
    
    // Set up notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // Save medications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
    setupNotifications();
  }, [medications]);
  


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTimeChange = (hour, minute, period) => {
    const formattedTime = `${hour}:${minute} ${period}`;
    setFormData(prev => ({
      ...prev,
      time: formattedTime
    }));
    setShowTimePicker(false);
  };

  // Format time in 12-hour format
  const formatTime = (hours, minutes, period) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Handle time selection from picker
  const handleTimeSelect = () => {
    const formattedTime = formatTime(selectedHour, selectedMinute, amPm);
    setFormData(prev => ({
      ...prev,
      time: formattedTime
    }));
    setShowTimePicker(false);
  };
  
  // Handle manual time input
  const handleTimeInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      time: value
    }));
    
    // Auto-format as user types
    if (value.length === 2 && !value.includes(':')) {
      setFormData(prev => ({
        ...prev,
        time: value + ':'
      }));
    }
  };
  
  // Format time when input loses focus
  const handleTimeBlur = (e) => {
    let time = e.target.value.trim().toUpperCase();
    const timeMatch = time.match(/^(\d{1,2}):?(\d{0,2})\s*([AP]M?)?$/i);
    
    if (timeMatch) {
      let [_, hours, minutes, period] = timeMatch;
      
      // Default to AM if not specified
      if (!period) period = 'AM';
      else if (period.length === 1) period += 'M';
      
      // Convert to numbers
      let hoursNum = parseInt(hours, 10) || 0;
      let minutesNum = parseInt(minutes, 10) || 0;
      
      // Validate hours (1-12)
      if (hoursNum < 1) hoursNum = 1;
      if (hoursNum > 12) hoursNum = 12;
      
      // Validate minutes (0-59)
      if (minutesNum < 0) minutesNum = 0;
      if (minutesNum > 59) minutesNum = 59;
      
      // Update form data and picker state
      const formattedTime = formatTime(hoursNum, minutesNum, period);
      setFormData(prev => ({
        ...prev,
        time: formattedTime
      }));
      
      setSelectedHour(hoursNum.toString().padStart(2, '0'));
      setSelectedMinute(minutesNum.toString().padStart(2, '0'));
      setAmPm(period);
    }
  };

  const handleTimeInputClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTimePicker(!showTimePicker);
  };
  
  const handleTimeInputFocus = (e) => {
    setIsFocused(true);
    e.target.select();
  };
  
  const handleTimeInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };
  
  // Toggle AM/PM
  const toggleAmPm = () => {
    const newAmPm = amPm === 'AM' ? 'PM' : 'AM';
    setAmPm(newAmPm);
    
    // Update the form data with the new period
    const formattedTime = formatTime(selectedHour, selectedMinute, newAmPm);
    setFormData(prev => ({
      ...prev,
      time: formattedTime
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: !prev.days[day]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newMedication = {
      id: editingId || Date.now().toString(),
      ...formData,
      time: formData.time,
      createdAt: new Date().toISOString()
    };

    if (editingId) {
      setMedications(medications.map(med => 
        med.id === editingId ? newMedication : med
      ));
      setEditingId(null);
    } else {
      setMedications([...medications, newMedication]);
    }
    
    // Reset form and close
    setFormData({
      name: '',
      dosage: '',
      time: '',
      days: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
      isRecurring: true,
      startDate: formatDate(new Date().toISOString().split('T')[0]),
      endDate: '',
      notes: ''
    });
    
    setIsFormOpen(false);
  };

  const handleEdit = (medication) => {
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      time: medication.time,
      days: medication.days || {
        monday: true, tuesday: true, wednesday: true, thursday: true, 
        friday: true, saturday: true, sunday: true
      },
      isRecurring: medication.isRecurring !== false,
      startDate: medication.startDate || new Date().toISOString().split('T')[0],
      endDate: medication.endDate || '',
      notes: medication.notes || ''
    });
    setEditingId(medication.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const setupNotifications = () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }

    // Clear existing notifications
    if (window.medicationTimeouts) {
      window.medicationTimeouts.forEach(timeout => clearTimeout(timeout));
    }

    const timeouts = [];
    
    medications.forEach(med => {
      const [hours, minutes] = med.time.split(':').map(Number);
      const now = new Date();
      const notificationTime = new Date();
      
      // Set the time for today's notification
      notificationTime.setHours(hours, minutes, 0, 0);
      
      // If the time has already passed today, schedule for tomorrow
      if (notificationTime <= now) {
        notificationTime.setDate(notificationTime.getDate() + 1);
      }
      
      const timeUntilNotification = notificationTime - now;
      
      // Only schedule if the time is in the future
      if (timeUntilNotification > 0) {
        const timeoutId = setTimeout(() => {
          showNotification(med);
          // Reschedule for the next day if it's a recurring medication
          if (med.isRecurring !== false) {
            setupNotifications();
          }
        }, timeUntilNotification);
        
        timeouts.push(timeoutId);
      }
    });
    
    window.medicationTimeouts = timeouts;
    // --- END setupNotifications ---
  };

  const showNotification = (medication) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification('Medication Reminder', {
        body: `💊 Time to take ${medication.name} (${medication.dosage})`,
        icon: '/logo.png',
        tag: `med-reminder-${medication.id}`
      });
      if (window.Audio) {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Could not play sound:', e));
      }
      
      // Close the notification after 30 seconds
      setTimeout(() => notification.close(), 30000);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showNotification(medication);
        }
      });
    }
  };

  const daysOfWeek = [
    { id: 'monday', label: 'M' },
    { id: 'tuesday', label: 'T' },
    { id: 'wednesday', label: 'W' },
    { id: 'thursday', label: 'T' },
    { id: 'friday', label: 'F' },
    { id: 'saturday', label: 'S' },
    { id: 'sunday', label: 'S' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medication Reminders</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your medications and set reminders</p>
        </div>
        <Button 
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: '',
              dosage: '',
              time: '',
              days: {
                monday: true, tuesday: true, wednesday: true, thursday: true, 
                friday: true, saturday: true, sunday: true
              },
              isRecurring: true,
              startDate: new Date().toISOString().split('T')[0],
              endDate: '',
              notes: ''
            });
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Medication
        </Button>
      </div>

      {/* History/Log Toggle */}
      <div className="mb-4 flex justify-end">
        <Button variant={showHistory ? "default" : "outline"} size="sm" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Hide History" : "Show History"}
        </Button>
      </div>

      {/* Medication History Log */}
      {showHistory && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Medication History</h2>
          {medicationHistory.length === 0 ? (
            <div className="text-gray-500">No history yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {medicationHistory.slice(0, 30).map(item => (
                <li key={item.id} className="py-2 flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-36">{new Date(item.time).toLocaleString()}</span>
                  <span className="font-medium text-blue-700 dark:text-blue-200">{item.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${item.action === 'taken' ? 'bg-green-100 text-green-800 dark:bg-green-900/30' : item.action === 'skipped' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30'}`}>{item.action}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Medication List */}
      <div className="space-y-4">
        {medications.length === 0 ? (
          <Card className="text-center py-12">
            <Clock3 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No medications added yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Click the "Add Medication" button to get started
            </p>
          </Card>
        ) : (
          medications.map(medication => (
            <Card key={medication.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {medication.name}
                    </h3>
                    <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">{medication.time}</span>
                      <span className="mx-2">•</span>
                      <span>Dosage: {medication.dosage}</span>
                    </div>
                    
                    {medication.notes && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {medication.notes}
                      </p>
                    )}
                    
                    <div className="flex gap-1 mt-3">
                      {Object.entries(medication.days || {}).map(([day, isActive]) => (
                        isActive && (
                          <span 
                            key={day} 
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md"
                          >
                            {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
  <Button
    variant="outline"
    size="sm"
    className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
    onClick={() => logMedicationAction(medication, "taken")}
  >
    Mark Taken
  </Button>
  <Button
    variant="outline"
    size="sm"
    className="text-yellow-600 border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
    onClick={() => logMedicationAction(medication, "skipped")}
  >
    Skip
  </Button>
</div>
<div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(medication)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDelete(medication.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Medication Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Medication' : 'Add New Medication'}</CardTitle>
              <CardDescription>
                {editingId ? 'Update the medication details' : 'Enter the details of your medication'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Amoxicillin 500mg"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleInputChange}
                      placeholder="e.g., 1 pill"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 relative">
                    <Label>Time</Label>
                    <div className="relative">
                      <div className="relative">
                        <Input
                          type="text"
                          value={formData.time}
                          onChange={handleTimeInputChange}
                          onBlur={(e) => {
                            handleTimeBlur(e);
                            setIsFocused(false);
                          }}
                          onFocus={handleTimeInputFocus}
                          onKeyDown={handleTimeInputKeyDown}
                          onClick={handleTimeInputClick}
                          placeholder="HH:MM AM/PM"
                          className={`w-full pr-10 font-mono transition-all ${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
                        />
                        <Clock 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                          onClick={handleTimeInputClick}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={handleTimeInputClick}
                        className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:bg-transparent"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {showTimePicker && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Time Display Header */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center justify-center space-x-1">
                            <div className="text-4xl font-mono font-bold">
                              {selectedHour}:{selectedMinute}
                            </div>
                            <button 
                              onClick={toggleAmPm}
                              className="px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium"
                            >
                              {amPm}
                            </button>
                          </div>
                        </div>
                        
                        {/* Time Selection Grid */}
                        <div className="p-3">
                          {/* Hours */}
                          <div className="mb-4">
                            <div className="text-xs text-gray-500 font-medium mb-2 px-1">Hour</div>
                            <div className="grid grid-cols-6 gap-1">
                              {Array.from({length: 12}, (_, i) => {
                                const hour = (i + 1).toString().padStart(2, '0');
                                const isSelected = selectedHour === hour;
                                return (
                                  <button
                                    key={hour}
                                    onClick={() => setSelectedHour(hour)}
                                    className={`p-2 rounded-md text-sm font-medium transition-all ${
                                      isSelected 
                                        ? 'bg-blue-500 text-white shadow-md' 
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                  >
                                    {hour}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Minutes */}
                          <div className="mb-4">
                            <div className="text-xs text-gray-500 font-medium mb-2 px-1">Minute</div>
                            <div className="grid grid-cols-4 gap-1">
                              {['00', '15', '30', '45'].map(minute => {
                                const isSelected = selectedMinute === minute;
                                return (
                                  <button
                                    key={minute}
                                    onClick={() => setSelectedMinute(minute)}
                                    className={`p-2 rounded-md text-sm font-medium transition-all ${
                                      isSelected
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                  >
                                    {minute}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button
                              onClick={() => setShowTimePicker(false)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleTimeSelect}
                              className="px-6 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm"
                            >
                              Set Time
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Days of the Week</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="isRecurring">Recurring</Label>
                      <Switch
                        id="isRecurring"
                        checked={formData.isRecurring}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, isRecurring: checked }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    {daysOfWeek.map((day) => (
                      <div key={day.id} className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-1">{day.label}</span>
                        <button
                          type="button"
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            formData.days[day.id] 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}
                          onClick={() => handleDayToggle(day.id)}
                        >
                          {day.label}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  {!formData.isRecurring && (
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date (Optional)</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={formData.startDate}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g., Take after meals"
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update Medication' : 'Add Medication'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MedicationReminder;
