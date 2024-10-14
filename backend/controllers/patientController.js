import { db } from '../config/db.js'; // Adjust this path as needed

// Function to generate auto-incremented patient IDs
const generatePatientId = async () => {
    const patientsSnapshot = await db.collection('patients').get();
    const patientIds = patientsSnapshot.docs.map(doc => doc.data().patientId);

    // Extract numeric part and find the highest number
    const maxId = patientIds
        .map(id => parseInt(id.replace('PAT', '')))
        .reduce((max, curr) => (curr > max ? curr : max), 0);

    // Generate new patient ID
    const newId = `PAT${String(maxId + 1).padStart(3, '0')}`;
    return newId;
};

// Create a new patient
export const createPatient = async (req, res) => {
    const { patientName, age, gender, contactNo, address } = req.body;

    const userId = req.userId; 

    if (!patientName || !age || !gender || !contactNo || !address || !userId) {
        return res.status(400).send('Missing required fields.');
    }
    try {
        const patientId = await generatePatientId();
        const newPatient = {
            patientId,
            patientName,
            age,
            gender,
            contactNo,
            address,
            userId,
            
        };

        await db.collection('patients').add(newPatient);
        res.status(201).json({ message: `Patient created with ID: ${patientId}` });

    } catch (error) {
        console.error('Error creating patient: ', error);
        res.status(500).send('Error creating patient');
    }
};

// Get patients for a particular user
export const getPatients = async (req, res) => {
    const userId = req.userId; // Assuming you're getting the userId from a middleware that decodes the token

    try {
        // Fetch all patients for the specific user
        const patientsSnapshot = await db.collection('patients').where('userId', '==', userId).get();
        const patients = patientsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Fetch all doctors
        const doctorsSnapshot = await db.collection('doctors').get();
        const doctors = {};
        doctorsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            doctors[data.doctorId] = data.name; // Create a mapping of doctorId to doctor name
        });

        // Combine patient data with doctor names
        const patientsWithDoctorNames = patients.map(patient => ({
            patientId: patient.patientId,
            patientName: patient.patientName,
            age: patient.age,
            gender: patient.gender,
            contactNo: patient.contactNo,
            address: patient.address,
            doctorName: doctors[patient.doctorId] || 'Unknown', // Lookup doctor name
        }));

        res.status(200).json(patientsWithDoctorNames);
    } catch (error) {
        console.error('Error fetching patients: ', error);
        res.status(500).send('Error fetching patients');
    }
};

// Get a patient by ID
// Get a patient by ID
export const getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const patientDoc = await db.collection('patients').doc(id).get();
        if (!patientDoc.exists) {
            return res.status(404).send('Patient not found');
        }

        const patientData = patientDoc.data();
        
        // Fetch the doctor's details using doctorId
        const doctorDoc = await db.collection('doctors').doc(patientData.doctorId).get();
        const doctorName = doctorDoc.exists ? doctorDoc.data().name : 'Unknown';

        // Combine patient data with doctor's name
        const patientWithDoctorName = {
            id: patientDoc.id,
            patientId: patientData.patientId,
            patientName: patientData.patientName,
            date: patientData.date,
            doctorName: doctorName,
            department: patientData.department,
            prescription: patientData.prescription,
            description: patientData.description
        };

        res.status(200).json(patientWithDoctorName);
    } catch (error) {
        console.error('Error fetching patient: ', error);
        res.status(500).send('Error fetching patient');
    }
};

// Update a patient
export const updatePatient = async (req, res) => {
    const { id } = req.params;
    const { patientName, date, doctorName, department, prescription, description } = req.body;

    try {
        const patientDoc = await db.collection('patients').doc(id);

        if (!(await patientDoc.get()).exists) {
            return res.status(404).send('Patient not found');
        }

        await patientDoc.update({
            patientName,
            date,
            doctorName,
            department,
            prescription,
            description,
        });

        res.status(200).send('Patient updated successfully');
    } catch (error) {
        console.error('Error updating patient: ', error);
        res.status(500).send('Error updating patient');
    }
};

// Delete a patient
export const deletePatient = async (req, res) => {
    const { id } = req.params;

    try {
        const patientDoc = await db.collection('patients').doc(id);

        if (!(await patientDoc.get()).exists) {
            return res.status(404).send('Patient not found');
        }

        await patientDoc.delete();
        res.status(200).send('Patient deleted successfully');
    } catch (error) {
        console.error('Error deleting patient: ', error);
        res.status(500).send('Error deleting patient');
    }
};

export const getAllPatients = async (req, res) => {
    try {
      const patientRecords = [];
      const snapshot = await db.collection('patients').get();
  
      if (snapshot.empty) {
        return res.status(404).json({ message: 'No patient records found' });
      }
  
      snapshot.forEach((doc) => {
        patientRecords.push({ id: doc.id, ...doc.data() });
      });
  
      return res.status(200).json(patientRecords);
    } catch (error) {
      console.error('Error fetching patient records:', error);
      return res.status(500).json({ message: 'Failed to fetch patient records' });
    }
  };