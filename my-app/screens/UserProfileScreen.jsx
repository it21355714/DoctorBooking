import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator,KeyboardAvoidingView ,ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function UserProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);  // State to store the user data
  const [loading, setLoading] = useState(true);     // State to manage loading
  const [error, setError] = useState(null);         // State to handle errors

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
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(error.message); // Handle the error
      } finally {
        setLoading(false); // Stop loading after the fetch
      }
    };

    fetchUserProfile(); // Call the fetch function
  }, []); // Empty dependency array to run only once on mount

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

  // If user data exists, display it
  return (
    <ImageBackground
    source={require('../assets/images/bg.jpg')} // Replace with your image
    style={styles.background}
  >
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {userData ? (
        <>
          <Text style={styles.label}>Name: <Text style={styles.info}>{userData.fullName}</Text></Text>
          <Text style={styles.label}>Email: <Text style={styles.info}>{userData.email}</Text></Text>
          <Text style={styles.label}>Phone: <Text style={styles.info}>{userData.phone}</Text></Text>



    
          {/* Add an edit button if needed */}
          <Button
            mode="contained"
            onPress={() => navigation.navigate('EditProfile', { userId: userData.userId })} // Pass userId to EditProfile
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        </>
      ) : (
        <Text>User data not available.</Text>
      )}
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
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  editButton: {
    marginTop: 20,
    backgroundColor:'#14A3C7',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
