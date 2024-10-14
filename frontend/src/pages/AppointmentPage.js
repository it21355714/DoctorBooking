import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState([]);
    // Appointment list example (same as previous example)

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialize navigation hook

  useEffect(() => {
    // Fetch appointment data from backend
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appointments'); // API endpoint for getting appointments
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigate to Add Appointment form
  const handleAddAppointment = () => {
    navigate('/add-appointment'); // Redirect to the add appointment form page
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Appointment Records</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by patient, doctor, or specialization"
          value={searchTerm}
          style={{ maxWidth: '400px' }}
          onChange={handleSearch}
        />
      </div>

      {/* Add Appointment Button */}
     

      {/* Appointment Table (same as before) */}
      <table className="table table-striped table-hover">
      <thead className="table-primary">
          <tr>
            <th>Appointment ID</th>
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Specialization</th>
            <th>Date</th>
            <th>Time</th>
           
            <th>Consultation Fees</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.appointmentId}</td>
                <td>{appointment.patientName}</td>
                <td>{appointment.doctorName}</td>
                <td>{appointment.specialization}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
              
                <td>${appointment.consultationFees}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No appointments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
