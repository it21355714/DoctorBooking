import React from 'react';
import { View, StyleSheet, ScrollView, Text,Image,KeyboardAvoidingView ,ImageBackground} from 'react-native';
import { Card, Title, IconButton } from 'react-native-paper';
import Sidebar from '../src/components/Sidebar';  // Sidebar Component
import { TouchableOpacity } from 'react-native';




import hospitalImage1 from '../assets/images/hospital1.webp';
import hospitalImage2 from '../assets/images/hospital2.jpg';
import hospitalImage3 from '../assets/images/hospital3.jpg';

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground
    source={require('../assets/images/bg.jpg')} // Replace with your image
    style={styles.background}
  >
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* Sidebar */}
      <Sidebar navigation={navigation} />

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Top Part: Scrollable Cart */}
        <View style={styles.topPart}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
           
          <Card style={styles.card}>
  <TouchableOpacity onPress={() => navigation.navigate('DoctorList')} style={styles.touchableCard}>
  <View style={styles.imageContainer}>
    <Image
      source={require('../assets/images/Male-young-doctor-transparent-PNG.png')} // Replace with your image path
      style={styles.cardImage}
    />
     </View>
    <Card.Content style={styles.cardContent}>
      <Title style={styles.cardTitle}>Doctors</Title>
    </Card.Content>
  </TouchableOpacity>
            </Card>

{/*           
              <Card style={styles.card}>
              <TouchableOpacity onPress={() => navigation.navigate('BookDoctor')} style={styles.touchableCard}>
                <Card.Content>
                  <IconButton icon="doctor" size={40} />
                  <Title>Book</Title>
                </Card.Content>
                </TouchableOpacity>
              </Card> */}
              
            <Card style={styles.card}>
                <TouchableOpacity onPress={() => navigation.navigate('BookDoctor')} style={styles.touchableCard}>
                     <View style={styles.imageContainer}>
                   <Image
                          source={require('../assets/images/booking.png')} // Replace with your image path
                           style={styles.cardImage}
                       />
                   </View>
                <Card.Content style={styles.cardContent}>
                     <Title style={styles.cardTitle}>Booking</Title>
                    </Card.Content>
                 </TouchableOpacity>
            </Card>
           

           
              {/* <Card style={styles.card}>
              <TouchableOpacity onPress={() => navigation.navigate('PaymentHistory', { userId: 'currentUserId' })} style={styles.touchableCard}>
                <Card.Content>
                  <IconButton icon="currency-usd" size={40} />
                  <Title>Payments</Title>
                </Card.Content>
                </TouchableOpacity>
              </Card> */}
            <Card style={styles.card}>
                <TouchableOpacity onPress={() => navigation.navigate('PaymentHistory', { userId: 'currentUserId' })} style={styles.touchableCard}>
                     <View style={styles.imageContainer}>
                   <Image
                          source={require('../assets/images/payment.png')} // Replace with your image path
                           style={styles.cardImage}
                       />
                   </View>
                <Card.Content style={styles.cardContent}>
                     <Title style={styles.cardTitle}>Payment</Title>
                    </Card.Content>
                 </TouchableOpacity>
            </Card>

           
            

            <Card style={styles.card}>
                <TouchableOpacity onPress={() => navigation.navigate('PatientList', { userId: 'currentUserId' })} style={styles.touchableCard}>
                     <View style={styles.imageContainer}>
                   <Image
                          source={require('../assets/images/patient.png')} // Replace with your image path
                           style={styles.cardImage}
                       />
                   </View>
                <Card.Content style={styles.cardContent}>
                     <Title style={styles.cardTitle}>Patients</Title>
                    </Card.Content>
                 </TouchableOpacity>
            </Card>
           

{/*           
              <Card style={styles.card}>
              <TouchableOpacity onPress={() => navigation.navigate('CreatePatient')} style={styles.touchableCard}>
                <Card.Content>
                  <IconButton icon="account-plus" size={40} />
                  <Title>Add</Title>
                </Card.Content>
                </TouchableOpacity>
              </Card> */}
           <Card style={styles.card}>
                <TouchableOpacity onPress={() => navigation.navigate('CreatePatient' )} style={styles.touchableCard}>
                     <View style={styles.imageContainer}>
                   <Image
                          source={require('../assets/images/addPatient.webp')} // Replace with your image path
                           style={styles.cardImage}
                       />
                   </View>
                <Card.Content style={styles.cardContent}>
                     <Title style={styles.cardTitle}>Add</Title>
                    </Card.Content>
                 </TouchableOpacity>
            </Card>

           
              {/* <Card style={styles.card}>
              <TouchableOpacity onPress={() => navigation.navigate('BookingDetails')} style={styles.touchableCard}>
                <Card.Content>
                  <IconButton icon="cart" size={40} />
                  <Title>Bookings</Title>
                </Card.Content>
                </TouchableOpacity>
              </Card>
            */}

<Card style={styles.card}>
                <TouchableOpacity onPress={() => navigation.navigate('BookingDetails' )} style={styles.touchableCard}>
                     <View style={styles.imageContainer}>
                   <Image
                          source={require('../assets/images/appointment.png')} // Replace with your image path
                           style={styles.cardImage}
                       />
                   </View>
                <Card.Content style={styles.cardContent}>
                     <Title style={styles.cardTitle}>Schedule</Title>
                    </Card.Content>
                 </TouchableOpacity>
            </Card>

            
          </ScrollView>
        </View>
   {/* Bottom Part: Hospital Information */}
   <View style={styles.bottomPart}>
  {/* Hospital Images */}
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.imageScroll}
    contentContainerStyle={{ paddingBottom: 0 }} // Ensure no extra padding
  >
    <Image
      source={hospitalImage1} // Use the imported image
      style={styles.hospitalImage}
    />
    <Image
      source={hospitalImage2} // Use the imported image
      style={styles.hospitalImage}
    />
    <Image
      source={hospitalImage3} // Use the imported image
      style={styles.hospitalImage}
    />
  </ScrollView>
  <ScrollView>
  {/* Hospital Info Section */}
  <Text style={styles.hospitalInfoTitle}>Welcome to Our Hospital</Text>
  
  {/* Hospital Details */}
  <Text style={styles.hospitalInfoText}>
    We provide the best healthcare services with a dedicated team of professionals.
  </Text>
  <Text style={styles.hospitalInfoText}>
  Welcome to Our Hospital!

At Health Bridge, we are dedicated to providing exceptional healthcare services to our community. With a team of highly skilled professionals, we prioritize patient care and comfort. Our state-of-the-art facilities and advanced medical technologies ensure that you receive the best treatment available.

We offer a wide range of services, including emergency care, specialized treatments, and preventive health programs.  Welcome to Health Bridge where your health matters most!


  
  
  </Text>
  </ScrollView>
</View>
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
    flexDirection: 'row',
    flex: 1,
 
  },
  mainContent: {
    flex: 1,
    padding: 10,
   // Background color for main content
  },
  topPart: {
    height: '30%', // Top half of the screen
  },
  bottomPart: {
    height: '70%', // Bottom half of the screen
    padding: 0,
    backgroundColor: 'transparent', // White background for bottom part
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    elevation: 1, // Shadow effect
  },
  touchableCard: {
    marginHorizontal: 10, // Space around each card to separate them
  },
 
  hospitalInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft:55,
    marginBottom: 30, // Add some space above the title if needed
  },
  hospitalInfoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginLeft:25,
    marginBottom: 50, // Add some space above the text if needed
  },
  hospitalImage: {
    width: 200, // Set the desired width
    height: 150, // Set the desired height
    marginRight: 10, // Space between images
    borderRadius: 10, // Rounded corners for images
    resizeMode: 'cover', // Ensure the image covers the area
  },
  card: {
    
    width: 180, // Width of the card
    height: 150, // Height of the card
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden', // Ensures content doesn't overflow
    elevation: 0, // Set elevation to 0 to remove shadow
    borderWidth: 0, // Remove border width
    borderColor: 'transparent', // Set border color to transparent
    alignItems: 'center', // Center contents horizontally
    justifyContent: 'center', // Center contents vertically
  },
  cardImage: {
   
    width: 120, // Make the image take the full width
    height: 120, // Make the image take the full height
    resizeMode: 'cover', // Cover the entire card area
  },
  cardContent: {
    position: 'absolute', // Position content over the image
    bottom: 0, // Align content to the bottom
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional: Semi-transparent background for text
    alignItems: 'center',
    paddingVertical: 2, // Padding for better spacing
    marginBottom:10
  },
  cardTitle: {
    color: 'black', // Adjust text color if needed
    fontSize: 18, // Adjust font size for better visibility
  marginBottom:10,

  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center', // Center the image vertically
    alignItems: 'center', // Center the image horizontally
  },
});