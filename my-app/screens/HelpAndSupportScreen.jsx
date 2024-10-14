// HelpAndSupportScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button,KeyboardAvoidingView ,ImageBackground } from 'react-native';

const HelpAndSupportScreen = () => {
  const [feedback, setFeedback] = useState('');

  const handleFeedbackSubmit = () => {
    // Here you can handle the feedback submission
    console.log('Feedback submitted:', feedback);
    setFeedback(''); // Clear feedback input after submission
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>

      <Text style={styles.subtitle}>Frequently Asked Questions</Text>
      <Text style={styles.faq}>Q: How can I reset my password?</Text>
      <Text>A: You can reset your password from the login page by clicking on "Forgot Password."</Text>
      
      <Text style={styles.faq}>Q: How do I contact support?</Text>
      <Text>A: You can contact support at support@example.com.</Text>

      <Text style={styles.subtitle}>Send Us Your Feedback</Text>
      <TextInput
        style={styles.input}
        placeholder="Your feedback..."
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />
      <Button title="Submit Feedback" onPress={handleFeedbackSubmit} />

      <Text style={styles.contact}>For immediate assistance, please call 1-800-123-4567.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  faq: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    height: 100,
  },
  contact: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default HelpAndSupportScreen;
