import React, { useEffect, useState } from 'react';
import axios from 'axios';
export default function PaymentRecordPage() {
  // Sample payment data with patientId
  const [payments, setPayments] = useState([]);

  // State for search input
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);
  // Filter payments based on search query (by Payment ID, User ID, or Patient ID)
  const filteredPayments = payments.filter((payment) => {
    return (
      payment.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.patientId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  useEffect (()=>{
    const fetchPayments = async () =>{
      try{
        const response = await axios.get('http://localhost:5000/api/payments')
        setPayments(response.data)
        setLoading(false)
      }catch(error){
        setError('Error fetching payments');
        setLoading(false); // Set loading to false in case of an error
        console.error('Error fetching payments:', error);
      }
    }

    fetchPayments(); // Call the function to fetch payments
  }, []); 

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Customize the format as needed
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Payment Records</h2>

      {/* Search Box */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Payment ID, User ID, or Patient ID"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* Payment Table */}
      <table className="table table-striped table-hover">
      <thead className="table-primary">
          <tr>
            <th>Payment ID</th>
            <th>User ID</th>
            <th>Patient ID</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          
          </tr>
        </thead>
        <tbody>
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <tr key={payment.paymentId}>
                <td>{payment.paymentId}</td>
                <td>{payment.userId}</td>
                <td>{payment.patientId}</td>
                <td>${payment.amount}</td>
                <td> {formatDate(payment.date)}</td> {/* Format the date here */}
                <td>{payment.status}</td>
               
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No payment records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
