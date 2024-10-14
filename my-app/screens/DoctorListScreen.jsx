import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, ImageBackground, TouchableOpacity } from 'react-native';
import { Card, Title, Button, Avatar, Text } from 'react-native-paper';

export default function DoctorListScreen({ navigation }) {
  const [doctors, setDoctors] = useState([]); // State to store doctor data
  const [loading, setLoading] = useState(true); // State to show a loading indicator
  const [error, setError] = useState(null); // State to handle errors

  // Fetch doctor data from the backend
  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/api/doctor'); // Adjust URL as needed
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDoctors(data); // Set the fetched doctor data in state
    } catch (err) {
      setError('Failed to fetch doctor details');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };

  // Fetch the data when the component mounts
  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Loading doctor details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={fetchDoctors}>Retry</Button>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/images/bg.jpg')} // Replace with your image
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView>
          {doctors.map((doctor) => {
            const avatarSource = doctor.avatar ? { uri: doctor.avatar } : require('../assets/images/Male-young-doctor-transparent-PNG.png');

            return (
              <Card key={doctor.id} style={styles.card}>
                <Card.Content>
                  <View style={styles.cardContent}>
                    <Avatar.Image size={60} source={avatarSource} />
                    <View style={styles.detailsContainer}>
                      <Title>{doctor.name}</Title>
                      <Button
                        mode="contained"
                        style={styles.button}
                        onPress={() => navigation.navigate('DoctorDetails', { doctor })}
                      >
                        View Details
                      </Button>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          })}
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
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Make card semi-transparent for better visibility against background
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsContainer: {
    marginLeft: 16,
    flex: 1,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#14A3C7',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
