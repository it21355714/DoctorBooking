import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For fetching doctor and department data
import DatePicker from 'react-datepicker'; // Install: npm install react-datepicker
import 'react-datepicker/dist/react-datepicker.css';

export default function PatientRecordForm() {
  // Form state
  const [prescriptionName, setPrescriptionName] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  
  // Doctor and department options (these could be fetched from your backend)
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Fetch doctors and departments (mock API request)
  useEffect(() => {
    // Example: Replace with your actual API endpoints
   // axios.get('http://localhost:9000/api/auth/login').then((response) => setDoctors(response.data));
  //  axios.get('http://localhost:9000/api/auth/login').then((response) => setDepartments(response.data));
  }, []);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct form data
    const formData = {
      prescriptionName,
      selectedDoctor,
      selectedDepartment,
      date,
      description,
    };

    // Send data to backend (replace with actual API endpoint)
    axios.post('/api/patient-records', formData)
      .then((response) => {
        alert('Record added successfully!');
        // Clear form after successful submission
        setPrescriptionName('');
        setSelectedDoctor('');
        setSelectedDepartment('');
        setDate(new Date());
        setDescription('');
      })
      .catch((error) => {
        console.error('Error adding record:', error);
        alert('Failed to add record');
      });
  };

  return (
    <div className="container container_patient mt-5">
      <h2 className="mb-4 text-center">Add Patient Record</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
        
        {/* Prescription Name */}
        <div className="mb-3">
          <label className="form-label">Prescription Name:</label>
          <input
            type="text"
            className="form-control"
            value={prescriptionName}
            onChange={(e) => setPrescriptionName(e.target.value)}
            required
          />
        </div>

        {/* Select Doctor */}
        <div className="mb-3">
          <label className="form-label">Select Doctor:</label>
          <select
            className="form-select"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.name}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Select Doctor:</label>
          <select
            className="form-select"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.name}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>
        

        {/* Select Department */}
        <div className="mb-3">
          <label className="form-label">Select Department:</label>
          <select
            className="form-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            required
          >
            <option value="">-- Select Department --</option>
            {departments.map((department) => (
              <option key={department.id} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div className="mb-3">
          <label className="form-label">Select Date:</label>
          <DatePicker
            className="form-control"
            selected={date}
            onChange={(date) => setDate(date)}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Add Record Button */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary">Add Record</button>
        </div>
      </form>
    </div>
  );
};


