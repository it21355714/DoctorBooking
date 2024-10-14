import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList,KeyboardAvoidingView ,ImageBackground } from 'react-native';
import { Card, Title, Text, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PatientHistoryScreen() {
  const [patients, setPatients] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchPatientHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Get the token from AsyncStorage
  
      const response = await fetch('http://10.0.2.2:5000/api/patients/userid', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token for authentication
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Get error text for better error handling
        throw new Error(errorText || 'Failed to fetch patients');
      }
  
      const data = await response.json();
     // Log the received data to the console
      setPatients(data); // Set the fetched patients data to state
    } catch (error) {
      console.error('Error fetching patients:', error);
      setErrorMessage(error.message); // Set the error message
      setSnackbarVisible(true); // Show snackbar with error
    }
  };
  
  useEffect(() => {
    fetchPatientHistory();
  }, []);

  const renderPatientItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.patientName}</Title>
        <Text>Age: {item.age}</Text>
        <Text>Gender: {item.gender}</Text>
        <Text>Contact: {item.contactNo}</Text>
        <Text>Address: {item.address}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <ImageBackground
    source={require('../assets/images/bg.jpg')} // Replace with your image
    style={styles.background}
  >
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        data={patients}
        renderItem={renderPatientItem}
        keyExtractor={item => item.patientId} // Assuming patientId is the unique key
        contentContainerStyle={styles.list}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {errorMessage}
      </Snackbar>
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
    backgroundColor: 'transparent',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 8,
  },
});
