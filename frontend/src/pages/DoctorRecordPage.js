import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DoctorRecordPage() {
  const navigate = useNavigate();

  // Sample doctor data
  const [doctors, setDoctors] = useState([]);

  // State for search input
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/doctor');
        setDoctors(response.data); // Update state with fetched doctor data
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter((doctor) => {
    return (
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.id.toLowerCase().includes(searchQuery.toLowerCase()) // Ensure you use the correct field for document ID
    );
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Navigate to the "Add Doctor" form
  const handleAddDoctor = () => {
    navigate('/doctorRecordForm');
  };

  // Handle the edit action
  const handleEditDoctor = (docId) => {
    // Navigate to the edit form with the selected document ID
    navigate(`/editDoctor/${docId}`);
  };

  // Handle the delete action
  // Handle the delete action
const handleDeleteDoctor = async (docId) => {
  // Confirm before deleting
  if (window.confirm('Are you sure you want to delete this doctor?')) {
    try {
      // Call the API to delete the doctor
      await axios.delete(`http://localhost:5000/api/doctor/${docId}`);

      // If the API call is successful, update local state
      setDoctors(doctors.filter((doctor) => doctor.id !== docId)); // Use the document ID here

      // Optionally, show a success message
      alert('Doctor deleted successfully!');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('There was an error deleting the doctor. Please try again.');
    }
  }
};

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Doctor List</h2>

      {/* Search Box */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Doctor ID, Name, or Specialization"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ maxWidth: '400px' }}
        />
        <button className="btn btn-primary" onClick={handleAddDoctor}>
          Add Doctor
        </button>
      </div>

      {/* Doctor Table */}
      <table className="table table-striped table-hover">
      <thead className="table-primary">
          <tr>
            <th>Document ID</th> {/* Change to Document ID */}
            <th>Name</th>
            <th>Specialization</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Availability</th>
            <th>Consultation Fees</th>
            <th>Actions</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <tr key={doctor.id}> {/* Use the document ID here */}
                <td>{doctor.doctorId}</td> {/* Display Document ID */}
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.phoneNumber}</td>
                <td>{doctor.email}</td>
                <td>{doctor.availability}</td>
                <td>${doctor.consultationFees}</td>
                <td>
  {/* Action buttons */}
  <button
    className="btn btn-sm btn-warning me-2 " // Use 'me-2' for right margin
    onClick={() => handleEditDoctor(doctor.id)} // Pass document ID
  >
    Edit
  </button>
  <button
    className="btn btn-sm btn-danger mt-2 "
    onClick={() => handleDeleteDoctor(doctor.id)} // Pass document ID
  >
    Delete
  </button>
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No doctors found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
