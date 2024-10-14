import {db} from '../config/db.js'; // Firestore instance


const generateAppointmentId = async () => {
    const appointmentsSnapshot = await db.collection('appointments').get();
    const appointmentIds = appointmentsSnapshot.docs.map(doc => doc.data().appointmentId);
  
    // Extract numeric part and find the highest number
    const maxId = appointmentIds
      .map(id => parseInt(id.replace('APT', '')))
      .reduce((max, curr) => (curr > max ? curr : max), 0);
  
    // Generate new appointment ID
    const newId = `APT${String(maxId + 1).padStart(3, '0')}`;
    return newId;
  };
  const getConsultationFees = async (doctorId) => {
    try {
        const doctorDoc = await db.collection('doctors').where('doctorId', '==', doctorId).limit(1).get();
        if (doctorDoc.empty) {
            throw new Error('Doctor not found');
        }
        const doctorData = doctorDoc.docs[0].data();
        return doctorData.consultationFees; // Return the consultation fees of the doctor
    } catch (error) {
        console.error('Error fetching consultation fees: ', error);
        throw new Error('Could not retrieve consultation fees');
    }
};
const getDoctorSpecialization = async (doctorId) => {
    try {
        const doctorDoc = await db.collection('doctors').where('doctorId', '==', doctorId).limit(1).get();
        if (doctorDoc.empty) {
            throw new Error('Doctor not found');
        }
        const doctorData = doctorDoc.docs[0].data();
        return doctorData.specialization; // Return the specialization of the doctor
    } catch (error) {
        console.error('Error fetching doctor specialization: ', error);
        throw new Error('Could not retrieve doctor specialization');
    }
};

export const createAppointment = async (req, res) => {
  // Extract patientId, doctorId, date, time, and status from the request body
  const { patientId, doctorId, date, time, status } = req.body;

  // Extract userId from the request (set by authenticateToken)
  const userId = req.userId; // Assuming req.user contains user info after token verification

  // Validate required fields
  if (!patientId || !doctorId || !date || !time || !userId) {
      return res.status(400).send('Missing required fields.');
  }

  try {
      // Generate a new appointment ID
      const appointmentId = await generateAppointmentId();
      
      // Get consultation fees for the selected doctor
      const consultationFees = await getConsultationFees(doctorId);
      
      // Get the doctor's specialization if needed
      const specialization = await getDoctorSpecialization(doctorId);

      // Create the appointment object
      const newAppointment = {
          appointmentId,  // Generated appointment ID
          patientId,      // Patient ID from the request
          doctorId,       // Doctor ID from the request
          userId,         // User ID from the token
          specialization,  // Doctor's specialization
          date,           // Appointment date
          time,           // Appointment time
          status: status || 'Pending',  // Default to 'Pending'
          consultationFees // Consultation fees
      };

      // Save the appointment to the database
      await db.collection('appointments').add(newAppointment);
      
      // Respond with a success message and the new appointment ID
      res.status(201).send(`Appointment created with ID: ${appointmentId}`);
  } catch (error) {
      console.error('Error creating appointment: ', error);
      res.status(500).send('Error creating appointment');
  }
};

  
  const getPatientDetails = async (patientId) => {
    try {
        const patientDoc = await db.collection('patients').where('patientId', '==', patientId).get();
        if (patientDoc.empty) {
            console.log('No patient found for patientId:', patientId);
            return null; // Return null if no patient found
        }
        return patientDoc.docs[0].data(); // Return the first matched patient document data
    } catch (error) {
        console.error('Error fetching patient details:', error);
        return null; // Return null on error
    }
};

const getDoctorDetails = async (doctorId) => {
    try {
        const doctorDoc = await db.collection('doctors').where('doctorId', '==', doctorId).get();
        if (doctorDoc.empty) {
            console.log('No doctor found for doctorId:', doctorId);
            return null; // Return null if no doctor found
        }
        return doctorDoc.docs[0].data(); // Return the first matched doctor document data
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        return null; // Return null on error
    }
};

export const getAppointments = async (req, res) => {
    try {
        const snapshot = await db.collection('appointments').get();
        const appointments = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const appointmentData = { id: doc.id, ...doc.data() };

                // Fetch patient details
                const patient = await getPatientDetails(appointmentData.patientId);
                const doctor = await getDoctorDetails(appointmentData.doctorId);

                return {
                    appointmentId: appointmentData.appointmentId,
                    patientName: patient ? patient.patientName : 'Unknown', // Handle if patient not found
                    doctorName: doctor ? doctor.name : 'Unknown', // Handle if doctor not found
                    specialization: appointmentData.specialization,
                    date: appointmentData.date,
                    time: appointmentData.time,
                    status: appointmentData.status,
                    consultationFees: appointmentData.consultationFees,
                };
            })
        );

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments: ', error);
        res.status(500).send('Error fetching appointments');
    }
};

  export const getAppointmentById = async (req, res) => {
    const { id } = req.params; // Extracting ID from the request parameters
  
    try {
      // Fetch the specific appointment document from Firestore
      const appointmentDoc = await db.collection('appointments').doc(id).get();
  
      // Check if the document exists
      if (!appointmentDoc.exists) {
        return res.status(404).send('Appointment not found');
    }
  
    const appointment = appointmentDoc.data();
    const patientDoc = await db.collection('patients').doc(appointment.patientId).get();
    const doctorDoc = await db.collection('doctors').doc(appointment.doctorId).get();

    const patient = patientDoc.data();
    const doctor = doctorDoc.data();

    res.status(200).send({
        ...appointment,
        patient,
        doctor,
    });
} catch (error) {
    console.error('Error fetching appointment: ', error);
    res.status(500).send('Error fetching appointment');
}
};

  export const updateAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const { patientName, doctorName, specialization, date, time, status, consultationFees } = req.body;
  
    try {
      await db.collection('appointments').doc(appointmentId).update({
        patientName,
        doctorName,
        specialization,
        date,
        time,
        status,
        consultationFees,
      });
      res.status(200).send(`Appointment ${appointmentId} updated successfully.`);
    } catch (error) {
      console.error('Error updating appointment: ', error);
      res.status(500).send('Error updating appointment');
    }
  };
  

  export const deleteAppointment = async (req, res) => {
    const { appointmentId } = req.params;
  
    try {
      await db.collection('appointments').doc(appointmentId).delete();
      res.status(200).send(`Appointment ${appointmentId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting appointment: ', error);
      res.status(500).send('Error deleting appointment');
    }
  };
  


  export const getAppointmentsByUser = async (req, res) => {
    try {
        // Extract userId directly from the request object
        const userId = req.userId; 

        // Fetch appointments for the particular user
        const snapshot = await db.collection('appointments').where('userId', '==', userId).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No appointments found for this user' });
        }

        const appointments = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const appointmentData = { id: doc.id, ...doc.data() };

                const patient = await getPatientDetails(appointmentData.patientId);
                const doctor = await getDoctorDetails(appointmentData.doctorId);

                return {
                    appointmentId: appointmentData.appointmentId,
                    patientName: patient ? patient.patientName : 'Unknown',
                    doctorName: doctor ? doctor.name : 'Unknown',
                    specialization: appointmentData.specialization,
                    date: appointmentData.date,
                    time: appointmentData.time,
                    status: appointmentData.status,
                    consultationFees: appointmentData.consultationFees,
                };
            })
        );

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments: ', error);
        res.status(500).send('Error fetching appointments');
    }
};

