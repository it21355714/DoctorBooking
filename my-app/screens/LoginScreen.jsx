import React, { useState } from 'react';

import { View, StyleSheet, Alert, KeyboardAvoidingView ,ImageBackground} from 'react-native';
import { TextInput, Button, Card, Text} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Mark the handleLogin function as async
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    try {
      setLoading(true);
  
      // Make API request to log in
      const response = await fetch('http://10.0.2.2:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      // Log the full response to see what you receive
     // console.log('Login Response:', data);
  
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      // Check if data.userId exists before storing
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);  // Store the JWT token
      } else {
        console.error('Token not found in response:', data);
      }
  
     
      // Navigate to Home after successful login
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ImageBackground
    source={require('../assets/images/blur-hospital.jpg')} // Replace with your image
    style={styles.background}
  >
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Login</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Logging In...' : 'Login'}
          </Button>

          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('Signup')}
          >
            Don't have an account? Sign up
          </Text>
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
    justifyContent: 'center',
    padding: 16,
   
   
  },
  card: {
    padding: 20,
   backgroundColor:'transparent',
   
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
    color: '#1F45FC',
    textAlign: 'center',
  },
});
