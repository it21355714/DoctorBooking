import {db} from '../config/db.js'; // Firestore instance


// Function to generate auto-incremented doctor IDs
const generateDoctorId = async () => {
    const doctorsSnapshot = await db.collection('doctors').get();
    const doctorIds = doctorsSnapshot.docs.map(doc => doc.data().doctorId);

    // Extract numeric part and find the highest number
    const maxId = doctorIds
        .map(id => parseInt(id.replace('DOC', '')))
        .reduce((max, curr) => (curr > max ? curr : max), 0);

    // Generate new doctor ID
    const newId = `DOC${String(maxId + 1).padStart(3, '0')}`;
    return newId;
};

// Create a new doctor
export const createDoctor = async (req, res) => {
    const { name, specialization, phoneNumber, email, availability, consultationFees } = req.body;

    if (!name || !specialization || !phoneNumber || !email || !availability || !consultationFees) {
        return res.status(400).send('Missing required fields.');
    }

    try {
        const doctorId = await generateDoctorId(); // Generate the doctor ID
        const docRef = await db.collection('doctors').add({
            doctorId,
            name,
            specialization,
            phoneNumber,
            email,
            availability,
            consultationFees,
        });
        res.status(201).send(`Doctor created with ID: ${doctorId}`);
    } catch (error) {
        console.error('Error adding doctor: ', error);
        res.status(500).send('Error creating doctor');
    }
};

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctorsSnapshot = await db.collection('doctors').get();
    const doctors = doctorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors: ', error);
    res.status(500).send('Error fetching doctors');
  }
};

// Get a doctor by ID
// Get a doctor by ID
export const getDoctorById = async (req, res) => {
  const { doctorId } = req.params; // Use doctorId from route parameters
  console.log('Received doctorId:', doctorId); // Log the doctorId for debugging

  if (!doctorId) {
    return res.status(400).send('Doctor ID is required'); // Check if doctorId is provided
  }

  try {
    const doc = await db.collection('doctors').doc(doctorId).get(); // Fetch the document using doctorId
    if (!doc.exists) {
      return res.status(404).send('Doctor not found');
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).send('Error fetching doctor');
  }
};



// Update a doctor
export const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { name, specialization, phoneNumber, email, availability, consultationFees } = req.body;

  try {
    const doc = await db.collection('doctors').doc(id).get();
    if (!doc.exists) {
      return res.status(404).send('Doctor not found');
    }
    await db.collection('doctors').doc(id).update({
      name,
      specialization,
      phoneNumber,
      email,
      availability,
      consultationFees,
    });
    res.status(200).send('Doctor updated successfully');
  } catch (error) {
    console.error('Error updating doctor: ', error);
    res.status(500).send('Error updating doctor');
  }
};

// Delete a doctor
export const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.collection('doctors').doc(id).get();
    if (!doc.exists) {
      return res.status(404).send('Doctor not found');
    }
    await db.collection('doctors').doc(id).delete();
    res.status(200).send('Doctor deleted successfully');
  } catch (error) {
    console.error('Error deleting doctor: ', error);
    res.status(500).send('Error deleting doctor');
  }
};

