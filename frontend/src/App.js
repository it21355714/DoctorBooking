import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

import NavBar from './components/NavBar';
import Footer from './components/footer'; // Ensure consistent casing





import PatientRecordForm from './components/forms/PatientRecordForm';
import PatientRecordsPage from './pages/PatientRecordsPage';
import DoctorRecordForm from './components/forms/DoctorRecordForm';
import DoctorRecordPage from './pages/DoctorRecordPage';
import UserRecordsPage from './pages/UserRecordsPage';
import AppointmentPage from './pages/AppointmentPage';
import PaymentRecordPage from './pages/PaymentRecordPage';
import PaymentDetails from './pages/PaymentDetails';

function App() {
  const location = useLocation(); // Get the current location
  const [isSidebarMinimized, setSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setSidebarMinimized(!isSidebarMinimized);
  };

  // Check if the current path is the signup page
  const isLoginPage = location.pathname === '/';

  return (
    <div>
      {<NavBar />}
    
      
      <div className={`content ${isSidebarMinimized ? 'content-expanded' : 'content-collapsed'}`} style={{ padding: '20px', transition: 'margin-left 0.3s ease' }}>
        <Routes>
        
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/user-details" element={<div>User Details Page</div>} />
          <Route path="/doctor-details" element={<div>Doctor Details Page</div>} />
          <Route path="/patientRecordForm" element={< PatientRecordForm/>}/>
          <Route path="/patientRecordsPage" element={< PatientRecordsPage/>}/>
          <Route path="/doctorRecordForm" element={<DoctorRecordForm/>}/>
          <Route path="/editDoctor/:doctorId" element={<DoctorRecordForm />} /> 
          <Route path="/doctorRecordPage" element={<DoctorRecordPage/>}/> 
          <Route path="/" element={< UserRecordsPage/>}/> 
          <Route path="/appointmentPage" element={<AppointmentPage/>}/> 
          <Route path="/paymentRecordPage" element={<PaymentRecordPage/>}/> 
          <Route path="/paymentDetails" element={<PaymentDetails/>}/> 
          <Route path="/appointment-details" element={<div>Appointment Details Page</div>} />
          <Route path="/payment-details" element={<div>Payment Details Page</div>} />
          <Route path="/laboratory-details" element={<div>Laboratory Details Page</div>} />
         
         
        </Routes>
      </div>

      {/* {!isLoginPage && <Footer />} */}
    </div>
  );
}

// Wrap the App component in Router
const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
