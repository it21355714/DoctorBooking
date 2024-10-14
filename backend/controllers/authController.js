const admin = require('firebase-admin');

// Sign Up
exports.signup = async (req, res) => {
  const { email, password, fullName, phone, address, dob, gender } = req.body;

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
      // Additional user properties can go here
    });

    // Store additional user data in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      fullName,
      phone,
      address,
      dob,
      gender,
    });

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);
    
    // If you are using Firebase Admin SDK, you need to verify the password using Firebase client SDK or directly
    // Here we are assuming that you already have a client-side that handles the Firebase authentication and gets the ID token.

    // If successful, return the ID token
    const token = await admin.auth().createCustomToken(user.uid);
    res.status(200).json({ token }); // Send the custom token as a response
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
