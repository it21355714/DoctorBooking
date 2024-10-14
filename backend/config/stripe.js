import Stripe from 'stripe';
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Use the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Set your secret key in .env

export default stripe;
