import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView ,KeyboardAvoidingView ,ImageBackground} from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditProfileScreen({ route, navigation }) {
 const { userId } = route.params; // Get the userId passed from navigation
  const [userData, setUserData] = useState(null); // State to store user data
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch user profile data when the component is mounted
  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
          const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
          if (!token) {
            throw new Error('Token not found');
          }
  
          // API endpoint to fetch user data
          const response = await fetch('http://10.0.2.2:5000/api/users', { // Use the correct endpoint for fetching user data
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Pass token in Authorization header
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
  
          const data = await response.json();
        setUserData(data); // Set the user data
        // Populate the individual states with fetched user data
        setFullName(data.fullName);
        setEmail(data.email);
        setPhone(data.phone);
        setAddress(data.address);
        setDob(new Date(data.dob));
        setGender(data.gender);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrorMessage(error.message); // Handle the error
      } finally {
        setLoading(false); // Stop loading after the fetch
      }
    };

    fetchUserProfile(); // Fetch user data on component mount
  }, [userId]);


  const handleUpdateProfile = async () => {
    setLoading(true);

    const updatedData = {
      fullName,
      email,
      phone,
      address,
      dob: dob.toISOString().split('T')[0], // Format the date to YYYY-MM-DD
      gender,
    };

    try {

        const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
          if (!token) {
            throw new Error('Token not found');
          }
      const response = await fetch(`http://10.0.2.2:5000/api/users/update`, {
        method: 'PUT', // Update method
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert('Profile updated successfully!');
      navigation.navigate('Home'); // Go back to the previous screen
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onDobChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  return (
    <ImageBackground
    source={require('../assets/images/bg.jpg')} // Replace with your image
    style={styles.background}
  >
     <KeyboardAvoidingView style={styles.container} behavior="padding">
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Edit Profile</Text>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={text => setFullName(text)}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Phone"
            value={phone}
            onChangeText={text => setPhone(text)}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Address"
            value={address}
            onChangeText={text => setAddress(text)}
            mode="outlined"
            style={styles.input}
          />

          {/* Date of Birth Picker */}
          <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.input}>
            {`Date of Birth: ${dob.toLocaleDateString()}`}
          </Button>
          {showDatePicker && (
            <DateTimePicker
              value={userData.dob}
              mode="date"
              display="default"
              onChange={onDobChange}
            />
          )}

          {/* Gender Picker */}
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>

          <Button
            mode="contained"
            onPress={handleUpdateProfile}
            loading={loading}
            style={styles.button}
          >
            Update Profile
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
    </KeyboardAvoidingView>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover', // Makes the background cover the entire screen
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    backgroundColor:'#14A3C7',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

