import React, { useState } from 'react';
import { View, StyleSheet ,KeyboardAvoidingView ,ImageBackground} from 'react-native';
import { TextInput, Button, Card, Title, RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreatePatientScreen({ navigation }) {
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [address, setAddress] = useState('');

  const handleCreatePatient = async () => {
    const patientData = { patientName, age, gender, contactNo, address };
  
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token
  
      const response = await fetch('http://10.0.2.2:5000/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token for authentication
        },
        body: JSON.stringify(patientData),
      });
  
      // Check if the response is OK
      if (!response.ok) {
        throw new Error('Failed to create patient');
      }
  
      // If the response is a simple string, handle it as such
      const rawResponse = await response.text(); // Change to text() instead of json()
      console.log('Raw Response:', rawResponse); // Log the raw response
      // You can further process this if you need to, e.g., display a success message.
  
      // Optionally parse it if needed (if you decided to send JSON)
      // const data = JSON.parse(rawResponse);
      // console.log('Patient created successfully:', data.message);
  
      navigation.navigate('Home'); // Navigate back to Home or another screen after submission
    } catch (error) {
      console.error('Error creating patient: ', error);
    }
  };
  
  return (
    <ImageBackground
    source={require('../assets/images/bg.jpg')} // Replace with your image
    style={styles.background}
  >
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Card style={styles.card}>
        <Card.Content>
          <Title>Create Patient</Title>

          <TextInput
            label="Name"
            value={patientName}
            onChangeText={text => setPatientName(text)}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Age"
            value={age}
            onChangeText={text => setAge(text)}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.genderContainer}>
            <Title>Gender</Title>
            <RadioButton.Group
              onValueChange={value => setGender(value)}
              value={gender}
            >
              <View style={styles.radioButtonRow}>
                <View style={styles.radioButtonContainer}>
                  <RadioButton value="male" />
                  <Title style={styles.radioButtonLabel}>Male</Title>
                </View>
                <View style={styles.radioButtonContainer}>
                  <RadioButton value="female" />
                  <Title style={styles.radioButtonLabel}>Female</Title>
                </View>
              </View>
            </RadioButton.Group>
          </View>

          <TextInput
            label="Contact"
            value={contactNo}
            onChangeText={text => setContactNo(text)}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            label="Address"
            value={address}
            onChangeText={text => setAddress(text)}
            mode="outlined"
            style={styles.input}
          />

          <Button mode="contained" onPress={handleCreatePatient} style={styles.button}>
            Create Patient
          </Button>
        </Card.Content>
      </Card>
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
    
  },
  card: {
    padding: 20,
    backgroundColor:'transparent'
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    backgroundColor:'#14A3C7',
  },
  genderContainer: {
    marginBottom: 16,
  },
  radioButtonRow: {
    flexDirection: 'row', // This makes the Male and Female buttons appear on the same line
    alignItems: 'center',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  radioButtonLabel: {
    marginLeft: 8, // Add margin for spacing between button and label
   
  },
});
