import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert,KeyboardAvoidingView ,ImageBackground } from 'react-native';
import { Card, Title, Text, Button, Snackbar } from 'react-native-paper';
import { CardField, useStripe, StripeProvider } from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51PFY8304YP5YPcnyNfxDPVuitwsOJeI2kdhm63fqJumfDxJ24AyBhFPL9b10WAlU0jhC9HiqoEjuwKKhoIyWRp3S00MsKqrItD';

export default function PaymentScreen({ route, navigation }) {
  const { bookingData } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentSheetInitialized, setPaymentSheetInitialized] = useState(false);

  const fetchPaymentIntent = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('User authentication failed. Please log in again.');

      const response = await fetch('http://10.0.2.2:5000/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: bookingData.consultationFee * 100, // amount in cents
          currency: 'usd',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create payment intent: ${response.statusText}`);
      }

      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      setErrorMessage('Failed to initialize payment.');
      setSnackbarVisible(true);
      return null;
    }
  };

  const initializePaymentSheet = async () => {
    const clientSecret = await fetchPaymentIntent();
    if (!clientSecret) return;

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Your Business Name',  // Required: Set your business name here
      allowsDelayedPaymentMethods: true,  // Optional: If you want to support delayed payments
    });

    if (error) {
      console.error('Error initializing PaymentSheet:', error);
      setErrorMessage(`Failed to initialize payment sheet: ${error.message}`);
      setSnackbarVisible(true);
    } else {
      setPaymentSheetInitialized(true); // Payment sheet initialized successfully
    }
  };

  // const handlePayment = async () => {
  //   if (!paymentSheetInitialized) {
  //     setErrorMessage('Payment sheet is not initialized. Please try again.');
  //     setSnackbarVisible(true);
  //     return;
  //   }

  //   setLoading(true);
  //   const { error } = await presentPaymentSheet();

  //   setLoading(false);

  //   if (error) {
  //     console.error('Payment failed:', error);
  //     setErrorMessage(`Payment failed: ${error.message}`);
  //     setSnackbarVisible(true);
  //   } else {
  //     Alert.alert('Payment successful!');
  //     navigation.navigate('Home');
  //   }
  // };

  const handlePayment = async () => {
    // Get the patient ID from booking data
    const { patientId } = bookingData; // Ensure this contains the correct patientId
    console.log('Patient ID:', patientId);

    // Check if the payment sheet is initialized
    if (!paymentSheetInitialized) {
        setErrorMessage('Payment sheet is not initialized. Please try again.');
        setSnackbarVisible(true);
        return;
    }

    setLoading(true);
    const { error } = await presentPaymentSheet();
    setLoading(false);

    // Check for payment sheet errors
    if (error) {
        console.error('Payment failed:', error);
        setErrorMessage(`Payment failed: ${error.message}`);
        setSnackbarVisible(true);
    } else {
        // Payment succeeded, now make an API call to create the payment in Firebase
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('User authentication failed. Please log in again.');

            // Log the patient ID
            console.log('Patient ID:', patientId);

            // Prepare the request body without userId
            const requestBody = { patientId }; // Only send patientId
            console.log('Request Body:', JSON.stringify(requestBody));

            // Make the API call to create the payment
            const response = await fetch('http://10.0.2.2:5000/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert(`Payment successful! Payment ID: ${data.paymentId}`);
                await updateAppointment(appointmentId); 
                navigation.navigate('Home');
            } else {
                const errorData = await response.json();
                console.error('Error creating payment in Firebase:', errorData.error);
                setErrorMessage(`Payment succeeded but failed to create record: ${errorData.error}`);
                setSnackbarVisible(true);
            }
        } catch (error) {
            console.error('Error after payment success:', error);
            setErrorMessage('Payment succeeded but an error occurred while saving the payment.');
            setSnackbarVisible(true);
        }
    }
};


// New function to update appointment status
const updateAppointment = async (appointmentId) => {
  const token = await AsyncStorage.getItem('token'); // Retrieve the token for authentication
  const requestBody = {
      status: 'completed', // Set the status to completed
  };

  const response = await fetch(`http://10.0.2.2:5000/api/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
      const errorData = await response.json();
      console.error('Error updating appointment:', errorData.error);
      throw new Error(`Failed to update appointment: ${errorData.error}`);
  }

  console.log(`Appointment ${appointmentId} updated successfully.`);
};

  

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
     <ImageBackground
    source={require('../assets/images/bg.jpg')} // Replace with your image
    style={styles.background}
  >
    <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Card style={styles.card}>
          <Card.Content>
            <Title>Payment Details</Title>
            <Text>Patient Name: {bookingData.patientName}</Text>
            <Text>Doctor Name: {bookingData.doctorName}</Text>
            <Text>Consultation Fee: ${bookingData.consultationFee}</Text>
            <Text>Appointment Date: {bookingData.date}</Text>
            <Text>Appointment Time: {bookingData.time}</Text>
            <Text>Additional Notes: {bookingData.additionalNotes || 'N/A'}</Text>

            {/* CardField for collecting card information */}
            <CardField
              postalCodeEnabled={false}
              placeholder={{ number: '4242 4242 4242 4242' }}
              cardStyle={{ backgroundColor: '#FFFFFF', textColor: '#000000' }}
              style={{ width: '100%', height: 50, marginVertical: 30 }}
            />

            <Button
              mode="contained"
              onPress={handlePayment}
              loading={loading}
              disabled={!paymentSheetInitialized || loading}  // Disable if not initialized or loading
              style={styles.button}
            >
              Pay Now
            </Button>
          </Card.Content>
        </Card>

        {/* Snackbar for error/success messages */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {errorMessage}
        </Snackbar>
        </KeyboardAvoidingView>
      </ImageBackground>
    </StripeProvider>
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
    width: '90%',
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
});
