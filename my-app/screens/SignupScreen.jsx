import React, { useState } from 'react';
import { View, StyleSheet, ScrollView ,KeyboardAvoidingView ,ImageBackground} from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'; 
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState(''); // Gender state
  const [showDatePicker, setShowDatePicker] = useState(false); // State to show/hide date picker
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  // Make this function async
  const handleSignup = async () => {
    // Add your signup logic here (API calls, validation, etc.)
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    const userData = {
      fullName,
      email,
      phone,
      address,
      dob: dob.toISOString().split('T')[0], // Format the date to YYYY-MM-DD
      gender,
      password,
    };

    try {
      const response = await fetch('http://10.0.2.2:5000/api/users', { // Change this URL to your backend endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      // Optionally handle success
      alert('Signup successful!'); // Show success message
      navigation.navigate('Login'); // Navigate to the Login screen
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage(error.message); // Show error message
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Sign Up</Text>

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
              {`Select Date of Birth: ${dob.toLocaleDateString()}`}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={dob}
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

            <TextInput
              label="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            <Button mode="contained" onPress={handleSignup} style={styles.button}>
              Sign Up
            </Button>

            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate('Login')}
            >
              Already have an account? Login
            </Text>
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
    justifyContent: 'center',
    padding: 16,
   
  },
  card: {
    padding: 20,
    backgroundColor:'transparent'
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
  linkText: {
    marginTop: 20,
    color: '#6200ee',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
