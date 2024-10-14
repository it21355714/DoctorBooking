import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const NavBar = () => {
  return (
    <nav className="navbar bg-body-tertiary fixed-top">
  <div className="container-fluid ">
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasNavbar"
      aria-controls="offcanvasNavbar"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div
      className="offcanvas offcanvas-start sideBar"
      tabindex="-1"
      id="offcanvasNavbar"
      aria-labelledby="offcanvasNavbarLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Admin Menu</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/">
              Users
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/doctorRecordPage">
             Doctors
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/patientRecordsPage">
              Patients
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/appointmentPage">
             Appointments
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/paymentRecordPage">
             Payments
            </a>
          </li>
        </ul>
        
      </div>
    </div>

    {/* Move the brand to the right using ms-auto */}
    <a className="navbar-brand ms-auto" href="#">
      Health Bridge
    </a>
  </div>
</nav>
  );
};

export default NavBar;
