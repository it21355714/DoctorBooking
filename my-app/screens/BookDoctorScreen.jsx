import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator,KeyboardAvoidingView ,ImageBackground } from 'react-native';
import { Card, Title, Button, TextInput, Snackbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppointmentBooking({ navigation }) {
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctorsAndPatients = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      

      // Fetch doctors
      const doctorResponse = await fetch('http://10.0.2.2:5000/api/doctor', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const doctorData = await doctorResponse.json();
      setDoctors(doctorData);

      // Fetch patients for the current logged-in user
      const patientResponse = await fetch('http://10.0.2.2:5000/api/patients/userid', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const patientData = await patientResponse.json();
     // console.log('Patients:', patientData);
      setPatients(patientData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Failed to load data.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorsAndPatients();
  }, []);

  const validateInputs = () => {
    if (!doctorId) {
      setErrorMessage('Please select a doctor.');
      setSnackbarVisible(true);
      return false;
    }
    if (!patientId) {
      setErrorMessage('Please select a patient.');
      setSnackbarVisible(true);
      return false;
    }
    if (!date || !time) {
      setErrorMessage('Please select both appointment date and time.');
      setSnackbarVisible(true);
      return false;
    }
    return true;
  };

  const handleBookAppointment = async () => {
    if (!validateInputs()) {
        return;
    }

    try {
        const selectedDoctor = doctors.find((doc) => doc.doctorId === doctorId);
        const selectedPatient = patients.find((patient) => patient.patientId === patientId);

        const bookingData = {
            doctorId,
            doctorName: selectedDoctor?.name,
            consultationFee: selectedDoctor?.consultationFees,
            patientId,
            patientName: selectedPatient?.patientName,
            date: date.toLocaleDateString(),
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            additionalNotes,
            specialization: selectedDoctor?.specialization,
            


            // userId is not needed here since it will be handled in the backend
        };

        const requiredFields = ['doctorId', 'patientId', 'date', 'time'];

        const missingFields = requiredFields.filter(field => !bookingData[field]);
     
     
        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            setErrorMessage(`Missing required fields: ${missingFields.join(', ')}`);
            setSnackbarVisible(true);
            return;
        }
       
        // Send the booking data to the server
        const response = await fetch('http://10.0.2.2:5000/api/appointments', {
          // const response = await fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to book appointment.');
        }
console.log('booking data :',bookingData)
        // Navigate to Payment Screen with booking details
        navigation.navigate('Payment', { bookingData });
    } catch (error) {
        console.error('Error booking appointment:', error);
        setErrorMessage(error.message);
        setSnackbarVisible(true);
    }
};


  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set') {
      setDate(selectedDate || date);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === 'set') {
      setTime(selectedTime || time);
    }
  };

  return (
    <ImageBackground
    source={require('../assets/images/bg.jpg')} // Replace with your image
    style={styles.background}
  >
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Title  style={styles.heading}>Book Doctor Appointment</Title>
            {/* Patient Dropdown */}
           

            {/* Doctor Dropdown */}
            <View style={styles.pickerContainer}>
            <Picker
              selectedValue={doctorId}
              onValueChange={(itemValue) => setDoctorId(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Select Doctor" value="" />
              {doctors.map((doctor) => (
                <Picker.Item key={`doctor-${doctor.doctorId}`} label={doctor.name} value={doctor.doctorId} />
              ))}
            </Picker>
            </View>
            <View style={styles.pickerContainer}>
            <Picker
              selectedValue={patientId}
             
              onValueChange={(itemValue) => {
                console.log('Selected Patient ID:', itemValue); // Debugging line
                setPatientId(itemValue);
            }}
              style={styles.input}
            >
              <Picker.Item label="Select Patient" value="" />
              {patients.map((patient) => (
                <Picker.Item key={`patient-${patient.patientId}`} label={patient.patientName} value={patient.patientId} />
              ))}
            </Picker>
            </View>
            {/* Appointment Date Picker */}
            <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.input}>
              {`Select Appointment Date: ${date.toLocaleDateString()}`}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
                
                minimumDate={new Date()}
              />
            )}

            {/* Appointment Time Picker */}
            <Button mode="outlined" onPress={() => setShowTimePicker(true)} style={styles.input}>
              {`Select Appointment Time: ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </Button>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}

            {/* Additional Notes */}
            <TextInput
              label="Additional Notes"
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              mode="outlined"
              multiline
              theme={{
                colors: {
                  primary: 'black', // Outline color
                  text: 'black', // Font color
                  placeholder: 'black', // Placeholder text color
                },
              }}
              style={styles.input}
            />

            <Button mode="contained" onPress={handleBookAppointment} style={styles.button}>
              Book Appointment
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Error Snackbar */}
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
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  card: {
    width: '90%',
    padding: 20,
    backgroundColor:'transparent'
  },
  input: {
    marginVertical: 10,
   // Make the picker take the full height of the container
   borderWidth: 2,
    borderColor: '#14A3C7',
  },
  button: {
    marginTop: 20,
    backgroundColor:'#14A3C7',
  },
  pickerContainer: {

    borderWidth: 2, // Set the border width
    borderColor: '#14A3C7', // Set the border color
    borderRadius: 5, // Optional: round the corners
    marginBottom: 20, // Optional: space between pickers
    overflow: 'hidden', // Ensure the border doesn't cut off the picker
    height: 50, 
    
  },
  heading: {
    textAlign: 'center', // Center the text
    fontWeight: 'bold', // Make the text bold
    fontSize: 20, // Optional: adjust the font size as needed
    marginVertical: 16, // Optional: add vertical spacing
    color: '#000', // Optional: set the text color
  },
});
