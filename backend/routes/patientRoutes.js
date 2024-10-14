import express from 'express';
import { authenticateToken } from '../middleware/authenticate.js';
import {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    getAllPatients
} from '../controllers/patientController.js';




const patientRouter = express.Router();

patientRouter.post('/',authenticateToken,createPatient); // Create a new patient
patientRouter.get('/userid', authenticateToken, getPatients); // Get all patients
patientRouter.get('/:id', getPatientById); // Get a patient by ID
patientRouter.put('/:id', updatePatient); // Update a patient by ID
patientRouter.delete('/:id', deletePatient); // Delete a patient by ID


patientRouter.get('/',getAllPatients);
export default patientRouter;
