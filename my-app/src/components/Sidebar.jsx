import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const defaultHeaderHeight = hp(14);
    setHeaderHeight(defaultHeaderHeight);
  }, []);

  if (!isOpen) return null;

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    navigation.navigate('Login');
    toggleSidebar(); // Close sidebar after logout
  };

  const handleNavigation = (page) => {
    navigation.navigate(page);
    toggleSidebar(); // Close the sidebar after navigation
  };

  return (
    <View style={styles.overlay}>
      {/* Touch outside to close sidebar */}
      <TouchableWithoutFeedback onPress={toggleSidebar}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>

      {/* Sidebar content */}
      <View style={[styles.sidebar, { top: headerHeight }]}>
        <Button
          icon="account"
          mode="text"
          onPress={() => handleNavigation('UserProfile')}
          labelStyle={styles.buttonText}
        >
          Profile
        </Button>
        <Button
          icon="view-dashboard"
          mode="text"
          onPress={() => handleNavigation('Home')}
          labelStyle={styles.buttonText}
        >
          Dashboard
        </Button>
        <Button
          icon="bell"
          mode="text"
          onPress={() => handleNavigation('Notifications')}
          labelStyle={styles.buttonText}
        >
          Notifications
        </Button>
        <Button
          icon="help-circle"
          mode="text"
          onPress={() => handleNavigation('HelpAndSupport')}
          labelStyle={styles.buttonText}
        >
          Help & Support
        </Button>

        <Divider style={styles.divider} />

        <Button
          icon="logout"
          mode="text"
          onPress={handleLogout}
          labelStyle={styles.buttonText}
        >
          Log Out
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
  },
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay to simulate blur
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    width: 150,
    height: Dimensions.get('window').height,
    backgroundColor: '#25383C',
    padding: 10,
    zIndex: 1000,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
  },
});

export default Sidebar;


