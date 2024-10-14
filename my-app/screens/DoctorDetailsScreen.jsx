import React from 'react';
import { View, StyleSheet ,KeyboardAvoidingView ,ImageBackground} from 'react-native';
import { Title, Text } from 'react-native-paper';

export default function DoctorDetailsScreen({ route }) {
  const { doctor } = route.params; // Get doctor details from route parameters

  return (
    <ImageBackground
    source={require('../assets/images/bg.jpg')} // Replace with your image
    style={styles.background}
  >
    <KeyboardAvoidingView style={styles.container} behavior="padding">
    <View style={styles.card}>
        <Title style={styles.title}>Doctor Details</Title>
        <Text>ID: {doctor.doctorId}</Text>
        <Text>Name: {doctor.name}</Text>
        <Text>Specialization: {doctor.specialization}</Text>
        <Text>Phone: {doctor.phoneNumber}</Text>
        <Text>Email: {doctor.email}</Text>
        <Text>Availability: {doctor.availability}</Text>
        <Text>Consultation Fees: Rs {doctor.consultationFees}</Text>
      </View>
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
    backgroundColor:'transparent'
  },
  card: {
    backgroundColor: '#FFFFFF', // Background color of the card
    padding: 20, // Padding inside the card
    borderRadius: 10, // Rounded corners
    elevation: 3, // Shadow effect for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow radius for iOS
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft:90,
  },
  });
