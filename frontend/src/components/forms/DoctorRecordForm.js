import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function DoctorRecordForm() {
  const navigate = useNavigate();
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState({
    name: '',
    specialization: '',
    phoneNumber: '',
    email: '',
    availability: '',
    consultationFees: '',
  });

  useEffect(() => {
    // If doctorId exists, fetch the doctor's data for editing
    if (doctorId) {
      const fetchDoctor = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/doctor/${doctorId}`); // Use doctorId here
          setDoctor(response.data); // Set the form state with the fetched doctor's data
        } catch (error) {
          console.error('Error fetching doctor data:', error);
        }
      };

      fetchDoctor();
    }
  }, [doctorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log doctor details before sending
    console.log('Doctor details being submitted:', doctor);

    try {
      let response;
      // If editing, send a PUT request; otherwise, send a POST request
      if (doctorId) {
        response = await axios.put(`http://localhost:5000/api/doctor/${doctorId}`, doctor);
      } else {
        response = await axios.post('http://localhost:5000/api/doctor', doctor);
      }

      console.log('Server response status:', response.status);

      if (response.status === 200) { // Changed from response.ok to response.status
        const result = response.data; // No need to await here; response.data is already resolved
        console.log('Doctor created/updated successfully:', result); // Log success message

        // Redirect after successful submission
        navigate('/doctorRecordPage'); // Change to your desired route
      } else {
        const errorText = await response.text();
        console.error('Error creating/updating doctor:', errorText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container container_patient mt-5">
      <h2 className="mb-4 text-center">{doctorId ? 'Edit Doctor' : 'Add New Doctor'}</h2>
    
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={doctor.name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Specialization</label>
          <input
            type="text"
            className="form-control"
            name="specialization"
            value={doctor.specialization}
            onChange={handleChange}
            required
            placeholder="e.g., Cardiology, Dermatology"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            name="phoneNumber"
            value={doctor.phoneNumber}
            onChange={handleChange}
            required
            placeholder="Enter phone number"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={doctor.email}
            onChange={handleChange}
            required
            placeholder="Enter email address"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Availability</label>
          <select
            className="form-select"
            name="availability"
            value={doctor.availability}
            onChange={handleChange}
            required
          >
            <option value="Mon-Fri 9 AM - 5 PM">Mon-Fri 9 AM - 5 PM</option>
            <option value="Mon-Wed 10 AM - 4 PM">Mon-Wed 10 AM - 4 PM</option>
            <option value="Sat-Sun 8 AM - 1 PM">Sat-Sun 8 AM - 1 PM</option>
            <option value="Mon, Wed, Fri 2 PM - 6 PM">Mon, Wed, Fri 2 PM - 6 PM</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Consultation Fees</label>
          <input
            type="number"
            className="form-control"
            name="consultationFees"
            value={doctor.consultationFees}
            onChange={handleChange}
            required
            placeholder="Enter fees in USD"
          />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
