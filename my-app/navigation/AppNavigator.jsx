import React, { useState } from 'react'; // Make sure to import useState
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import CreatePatientScreen from '../screens/CreatePatientScreen';
import DoctorListScreen from '../screens/DoctorListScreen';
import DoctorDetailsScreen from '../screens/DoctorDetailsScreen';
import BookDoctorScreen from '../screens/BookDoctorScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PaymentHistoryScreen from '../screens/PaymentHistoryScreen';
import PatientHistoryScreen from '../screens/PatientHistoryScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import HelpAndSupportScreen from '../screens/HelpAndSupportScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import BookingDetailsScreen from '../screens/BookingDetailsScreen';
import HamburgerMenu from '../src/components/HamburgerMenu'; // Adjust the path based on your file structure
import Sidebar from '../src/components/Sidebar'; // Adjust the path based on your file structure

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Home',
            headerTintColor: '#FFFFFF', // White text color
          headerTitleAlign: 'center',
            headerStyle: { backgroundColor: '#29465B' }, // Add background color here
            headerRight: () => <HamburgerMenu onPress={toggleSidebar} />
          }} 
        />
        <Stack.Screen 
          name="CreatePatient" 
          component={CreatePatientScreen} 
          options={{ 
            title: 'Create Patient',
            headerTitleAlign: 'center',
            headerTintColor: '#FFFFFF', 
            headerStyle: { backgroundColor: '#29465B'}, // Add background color here
            headerRight: () => <HamburgerMenu onPress={toggleSidebar} />,
          }} 
        />
        <Stack.Screen 
          name="DoctorList" 
          component={DoctorListScreen} 
          options={{ 
            title: 'Doctors',
            headerTitleAlign: 'center',
            headerTintColor: '#FFFFFF', 
            headerStyle: { backgroundColor: '#29465B' }, // Add background color here
            headerRight: () => <HamburgerMenu onPress={toggleSidebar} />,
          }} 
        />
        <Stack.Screen 
          name="DoctorDetails" 
          component={DoctorDetailsScreen} 
          options={{ 
            title: 'Doctor Details',
            headerTitleAlign: 'center',
            headerTintColor: '#FFFFFF', 
            headerStyle: { backgroundColor: '#29465B' }, // Add background color here
            headerRight: () => <HamburgerMenu onPress={toggleSidebar} />,
          }} 
        />
        <Stack.Screen 
          name="BookDoctor" 
          component={BookDoctorScreen} 
          options={{ 
            title: 'Book Doctor',
            headerTitleAlign: 'center',
            headerTintColor: '#FFFFFF', 
            headerStyle: { backgroundColor: '#29465B' }, // Add background color here
            headerRight: () => <HamburgerMenu onPress={toggleSidebar} />,
          }} 
        />
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen} 
          options={{ 
            title: 'Payment',
            headerTitleAlign: 'center',
            headerTintColor: '#FFFFFF', 
            headerStyle: { backgroundColor: '#29465B'}, // Add background color here
            headerRight: () => <HamburgerMenu onPress={toggleSidebar} />,
          }} 
        />
        <Stack.Screen 
          name="PaymentHistory" 
          component={PaymentHistoryScreen} 
          options={{ 
            title: 'Payment History',
            headerTitleAlign: 'center',
            headerTintColor: '#FFFFFF', 
            headerStyle: {backgroundColor: '#29465B' }, // Add background color here
            headerRight: () => <HamburgerMenu onPress={toggleSidebar} />,
          }} 
        />
        <Stack.Screen 
          name="PatientList" 
          component={PatientHistoryScreen} 
          options={{ 
            title: 'Patient List',
            headerTitleAlign: 'center',
            headerTintColor: '#FFFFFF', 
            headerStyle: { backgroundColor: '#29465B' }, // Add background color here
            headerRight: () => <HamburgerMenu onPress={toggleSidebar} />,
          }} 
        />
        <Stack.Screen 
          name="UserProfile" 
          component={UserProfileScreen} 
          options={{ 
            title: 'Profile',
            headerTitleAlign: 'center',
            headerTintColor: '#FFFFFF', 
            headerStyle: {backgroundColor: '#29465B'}, // Add background color here
            headerRight: () => <HamburgerMenu onPress={toggleSidebar} />,
          }} 
        />
        <Stack.Screen 
          name="HelpAndSupport" 
          component={HelpAndSupportScreen} 
          options={{ 
            title: 'Help & Support',
            headerTitleAlign: 'center',
            headerTintColor: '#FFFFFF', 
            headerStyle: { backgroundColor: '#29465B'}, // Add background color here
            headerRight: () => <HamburgerMenu onPress={toggleSidebar} />,
          }} 
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen} 
          options={{ 
            title: 'Edit Profile',
            headerTitleAlign: 'center',
            headerTintColor: '#FFFFFF', 
            headerStyle: { backgroundColor: '#29465B' }, // Add background color here
            headerRight: () => <HamburgerMenu onPress={toggleSidebar} />,
          }} 
        />
        <Stack.Screen 
          name="BookingDetails" 
          component={BookingDetailsScreen} 
          options={{ 
            title: 'Booking Details',
            headerTitleAlign: 'center',
            headerTintColor: '#FFFFFF', 
            headerStyle: { backgroundColor: '#29465B' }, // Add background color here
            headerRight: () => <HamburgerMenu onPress={toggleSidebar} />,
          }} 
        />
      </Stack.Navigator>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}
