import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList,KeyboardAvoidingView ,ImageBackground } from 'react-native';
import { Card, Title, Text, Snackbar } from 'react-native-paper';

export default function PaymentHistoryScreen({ route }) {
  const { userId } = route.params;  // Get userId from navigation params
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:5000/api/payments`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }
      const data = await response.json();
      setPaymentHistory(data);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to load payment history');
      setSnackbarVisible(true);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const renderPaymentItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Payment ID: {item.paymentId}</Title>
        <Text>Amount: ${item.amount}</Text>
        <Text>Date: {item.date}</Text>
        <Text>Patient ID: {item.patientId}</Text>
        <Text>Status: {item.status}</Text>
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
        data={paymentHistory}
        renderItem={renderPaymentItem}
        keyExtractor={item => item.id}
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
    
  },
  list: {
    paddingBottom: 20,
   
  },
  card: {
    marginVertical: 8,
    backgroundColor: '#EEEEEE',
  },
});
