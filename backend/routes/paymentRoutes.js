import express from 'express';
import { authenticateToken } from '../middleware/authenticate.js';
import { createPayment, getPayments, getPaymentById, updatePayment, deletePayment } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

// Create a payment
paymentRouter.post('/', authenticateToken,createPayment);

// Get all payments
paymentRouter.get('/', getPayments);

// Get a payment by ID
paymentRouter.get('/:id', getPaymentById);

// Update a payment by ID
paymentRouter.put('/:id', updatePayment);

// Delete a payment by ID
paymentRouter.delete('/:id', deletePayment);

export default paymentRouter;
