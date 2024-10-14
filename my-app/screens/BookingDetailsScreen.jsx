import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Button,KeyboardAvoidingView ,ImageBackground, ScrollView,TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingDetailsScreen = ({ route, navigation }) => {
  
  const [bookingDetails, setBookingDetails] = useState(null); // State to store booking details
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors

  // Fetch booking details when the component is mounted
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
        if (!token) {
          throw new Error('Token not found');
        }

        // Replace with your API endpoint to fetch booking data
        const response = await fetch(`http://10.0.2.2:5000/api/appointments/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const data = await response.json();
      //  console.log(data); // Log the data to see the structure
        setBookingDetails(data); // Set booking details state
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError(error.message); // Handle the error
      } finally {
        setLoading(false); // Stop loading after the fetch
      }
    };

    fetchBookingDetails(); // Call the fetch function
  }, []);

  // Show a loading indicator while data is being fetched
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Show an error message if there's any error
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // If booking data exists, display it
  return (
    <ImageBackground
    source={require('../assets/images/bg.jpg')} // Replace with your image
    style={styles.background}
>
    <KeyboardAvoidingView style={styles.container} behavior="padding">
    <ScrollView>
        {bookingDetails && bookingDetails.length > 0 ? (
            bookingDetails.map((booking, index) => (
              <Card style={styles.card}>
      <Card.Content>
                <View key={index}>
                    <Text style={styles.label}>Booking ID: <Text style={styles.info}>{booking.appointmentId}</Text></Text>
                    <Text style={styles.label}>Doctor Name: <Text style={styles.info}>{booking.doctorName}</Text></Text>
                    <Text style={styles.label}>Patient Name: <Text style={styles.info}>{booking.patientName}</Text></Text>
                    <Text style={styles.label}>Appointment Date: <Text style={styles.info}>{booking.date}</Text></Text>
                    <Text style={styles.label}>Consultation Fee: <Text style={styles.info}>${booking.consultationFees}</Text></Text>
                   
                </View>
                </Card.Content>
                </Card>

            ))
        ) : (
            <Text>No booking details available.</Text>
        )}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
    </KeyboardAvoidingView>
</ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover', // Makes the background cover the entire screen
  },
  container: {
    flex: 1,
    padding: 20,
   
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  
  card: {
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#007BFF', // Set your desired button color here
    padding: 10,
    borderRadius: 10,
  
    marginBottom:10,
    alignItems: 'center', // Center the text horizontally
},
buttonText: {
    color: '#FFFFFF', // Set text color for the button
    fontSize: 16,
    fontWeight: 'bold',
},
});

export default BookingDetailsScreen;
