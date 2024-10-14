import {db} from '../config/db.js'; // Firestore instance
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Import JWT for token generation


const generateUserId = async () => {
    const usersSnapshot = await db.collection('users').get();
    const userIds = usersSnapshot.docs.map(doc => doc.data().userId);
  
    // Extract numeric part and find the highest number
    const maxId = userIds
      .map(id => parseInt(id.replace('USR', '')))
      .reduce((max, curr) => (curr > max ? curr : max), 0);
    
    // Generate new user ID
    const newId = `USR${String(maxId + 1).padStart(3, '0')}`;
    return newId;
  };
  

// Your createUser function
export const createUser = async (req, res) => {
    const { fullName, email, phone, address, dob, gender, password } = req.body;
  
    if (!fullName || !email || !phone || !address || !dob || !gender || !password) {
      return res.status(400).send('Missing required fields.');
    }
  
    try {
      // Generate a new user ID
      const userId = await generateUserId();
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const docRef = await db.collection('users').add({
        userId,
        fullName,
        email,
        phone,
        address,
        dob,
        gender,
        password: hashedPassword, // Save the hashed password
      });
  

    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Change this to your secret key

    res.status(201).json({ message: `User created with ID: ${userId}`, token }); 
    } catch (error) {
      console.error('Error adding user: ', error);
      res.status(500).send('Error creating user');
    }
  };

  export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Get user from Firestore
      const userSnapshot = await db.collection('users').where('email', '==', email).get();
  
      if (userSnapshot.empty) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const userData = userSnapshot.docs[0].data();
      const isPasswordValid = await bcrypt.compare(password, userData.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: userData.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ token }); // Send the token back to the client
    } catch (error) {
      console.error('Error logging in: ', error);
      res.status(500).send('Error logging in');
    }
  };
  
// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map((doc) => ({
      docId: doc.id, // Get Firestore document ID
      ...doc.data(),
    }));
  //  console.log(users); // Log the users with their document IDs
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).send('Error fetching users');
  }
};

// Get a user by ID


// Controller to get user by ID
export const getUserById = async (req, res) => {
  const userId = req.userId; // Extract userId from the request object
 // console.log('Fetching user with ID:', userId); // Log the userId for debugging

  try {
      // Query the users collection to find the user with the matching userId
      const userSnapshot = await db.collection('users').where('userId', '==', userId).get();

      if (userSnapshot.empty) {
          return res.status(404).json({ message: 'User not found' });
      }

      // If user exists, return the first matching document
      const userData = userSnapshot.docs[0].data();
      return res.status(200).json({ id: userSnapshot.docs[0].id, ...userData });
  } catch (error) {
      console.error('Error fetching user: ', error);
      return res.status(500).json({ error: 'Error fetching user', details: error.message });
  }
};
export const getUser = async (req, res) => {
  const docId = req.params.id; // Extract the Firestore document ID from request parameters

  try {
      // Access the document by its Firestore-generated ID (docId)
      const userDoc = await db.collection('users').doc(docId).get();

      // Check if the document exists
      if (!userDoc.exists) {
          return res.status(404).json({ message: 'User not found' });
      }

      // If the document exists, return the document data along with its ID
      const userData = userDoc.data();
      return res.status(200).json({ id: userDoc.id, ...userData });
  } catch (error) {
      console.error('Error fetching user: ', error);
      return res.status(500).json({ error: 'Error fetching user', details: error.message });
  }
};





// Update a user
export const updateUser = async (req, res) => {
  const userId = req.userId; 
  const { fullName, email, phone, address, dob, gender} = req.body;

  try {
    console.log('Updating user with userId:', userId); // Log userId for debugging

    // Fetch user document based on userId
    const snapshot = await db.collection('users').where('userId', '==', userId).get();

    if (snapshot.empty) {
      console.log('User not found for userId:', userId); // Log if user not found
      return res.status(404).send('User not found');
    }

    const userDoc = snapshot.docs[0]; // Get the first matching document

    // Log the userDoc to check if it's the correct document
    console.log('User document to be updated:', userDoc.data());

    // Update the user document
    await userDoc.ref.update({
      fullName,
      email,
      phone,
      address,
      dob,
      gender,
    //  password, // Ensure password is hashed if needed
    });

    console.log('User updated successfully:', userId); // Log success
    res.status(200).send('User updated successfully');
  } catch (error) {
    console.error('Error during user update:', error); // Improved error logging
    res.status(500).send('Error updating user');
  }
};


// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(`Received document ID: ${id}`); // Log the ID received

  try {
    const docRef = db.collection('users').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log('Document does not exist'); // Add more detailed logs
      return res.status(404).send('User not found');
    }

    // Proceed with deletion
    await docRef.delete();
    console.log('User deleted successfully'); // Log success message
    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error); // Print full error stack
    res.status(500).send('Error deleting user');
  }
};



