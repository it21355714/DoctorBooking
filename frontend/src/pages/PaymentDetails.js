import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests

export default function PaymentDetails() {
  const { paymentId } = useParams(); // Get the paymentId from the URL parameters
  const [payment, setPayment] = useState(null); // State for storing payment details
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(''); // State for error messages

  // Fetch payment details from the backend
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/payments`);
        const payments = response.data;

        // Find the payment by paymentId
        const selectedPayment = payments.find((p) => p.paymentId === paymentId);

        if (selectedPayment) {
          setPayment(selectedPayment); // Set the payment details if found
        } else {
          setError('Payment not found'); // Set error message if not found
        }
      } catch (err) {
        setError('Error fetching payment details'); // Set error message on fetch failure
      } finally {
        setLoading(false); // Set loading to false regardless of success or error
      }
    };

    fetchPaymentDetails();
  }, [paymentId]); // Dependency array: re-run effect when paymentId changes

  // Format the date to a user-friendly format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Customize the format as needed
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there's an error
  }

  if (!payment) {
    return <div>Payment not found</div>; // Show message if payment is not found
  }

  return (
    <div className="container mt-5">
      <h2>Payment Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Payment ID: {payment.paymentId}</h5>
          <p>User ID: {payment.userId}</p>
          <p>Patient ID: {payment.patientId}</p>
          <p>Amount: ${payment.amount}</p>
          <p>Date: {formatDate(payment.date)}</p> {/* Format the date here */}
          <p>Status: {payment.status}</p>
        </div>
      </div>
    </div>
  );
}
