import express from "express";
import { createDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor } from '../controllers/doctorController.js';


const doctorRoutes = express.Router();


doctorRoutes.post('/', createDoctor); // Create a doctor
doctorRoutes.get('/', getAllDoctors); // Get all doctors
doctorRoutes.get('/:doctorId', getDoctorById); // Get a doctor by ID
doctorRoutes.put('/:id', updateDoctor); // Update a doctor by ID
doctorRoutes.delete('/:id', deleteDoctor); // Delete a doctor by ID

export default doctorRoutes;
