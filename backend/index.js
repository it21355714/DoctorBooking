import express from 'express';
//const admin = require('firebase-admin');
import cors from "cors";
import doctorRoutes from './routes/doctorRoutes.js';
import userRoutes from  './routes/userRoutes.js'
import appointment from './routes/appointmentRoutes.js'
import patient from './routes/patientRoutes.js'
import payment from './routes/paymentRoutes.js'
import StripeRouter from './routes/stripeRoute.js';


const app = express();
const PORT = process.env.PORT || 3000;

// const serviceAccount = require('path/to/serviceAccountKey.json'); // Path to your service account key file

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// Firestore connection check function
app.use(express.json());
app.use(cors());

app.use('/api/doctor',doctorRoutes);
app.use('/api/users',userRoutes);
app.use('/api/appointments',appointment);
app.use('/api/patients',patient);
app.use('/api/payments',payment)
app.use('/api/stripe', StripeRouter); 
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


