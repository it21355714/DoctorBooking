// /controllers/paymentController.js
import stripe from '../config/stripe.js';// Import the configured Stripe instance

export const stripePayment = async (req, res) => {
  const { amount, currency } = req.body; // Amount in cents and currency passed from frontend

  try {
    // Create a payment intent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Example: amount = 2000 for $20.00
      currency, // Example: currency = 'usd'
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret, // Send the client secret back to the frontend
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};
