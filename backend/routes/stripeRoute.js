// /routes/paymentRoutes.js
import express from 'express';
import  {stripePayment}from '../controllers/stripePayment.js';


const StripeRouter = express.Router();

// POST /api/payment-intent - Create a payment intent
StripeRouter.post('/', stripePayment);


export default StripeRouter;