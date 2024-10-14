import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function PatientRecordsPage() {
  const navigate = useNavigate(); // Use for navigation

  // Sample patient records
  const [records, setRecords] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState(null);
  const [filteredRecords, setFilteredRecords] = useState(records);

  useEffect(() => {
    const filterData = () => {
      let filtered = records.filter((record) => {
        const matchesSearch = (
          (record.doctor?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (record.department?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (record.prescription?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (record.patientName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
  
        const matchesDate = filterDate ? record.date === filterDate.toISOString().split('T')[0] : true;
        return matchesSearch && matchesDate;
      });
  
      setFilteredRecords(filtered);
    };
  
    filterData();
  }, [searchTerm, filterDate, records]);

  useEffect(() => {
    const fetchPatientRecords = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patients'); // Replace with your backend URL
        const data = await response.json();
        setRecords(data); // Set the records fetched from the backend
        setFilteredRecords(data); // Set the same data as filtered initially
      } catch (error) {
        console.error('Error fetching patient records:', error);
      }
    };

    fetchPatientRecords();
  }, []);


  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Patient Records</h2>

      {/* Search and Filter Section */}
      <div className="d-flex mb-4">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by  patient name"
          value={searchTerm}
          style={{ maxWidth: '400px' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
       
      </div>

      {/* Records Table */}
      <table className="table table-striped table-hover">
      <thead className="table-primary">
          <tr>
            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Contact No</th>
            <th>Address</th>
           
           
          </tr>
        </thead>
        <tbody>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.patientId}</td>
                <td>{record.patientName}</td>
                <td>{record.age}</td>
                <td>{record.gender}</td>
                <td>{record.contactNo}</td>
                <td>{record.address}</td>
               
               
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
