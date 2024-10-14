import express from 'express';
import { createAppointment, getAppointments, updateAppointment, deleteAppointment, getAppointmentById,getAppointmentsByUser } from '../controllers/appointmentController.js';
import { authenticateToken } from '../middleware/authenticate.js';
const appointmentRouter = express.Router();

// Create a new appointment
appointmentRouter.post('/', authenticateToken,createAppointment);

// Get all appointments
appointmentRouter.get('/', getAppointments);

appointmentRouter.get('/user', authenticateToken, getAppointmentsByUser);
// Update an appointment
appointmentRouter.put('/:id', updateAppointment);

// Delete an appointment
appointmentRouter.delete('/:id', deleteAppointment);

export default appointmentRouter;
