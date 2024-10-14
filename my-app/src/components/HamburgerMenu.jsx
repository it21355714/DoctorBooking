import React from 'react';
import { IconButton } from 'react-native-paper';

const HamburgerMenu = ({ onPress }) => {
  return (
    <IconButton
      icon="menu" // Use the menu icon
      size={30}
      iconColor='#fff'
      onPress={onPress} // Call the function passed from the parent
    />
  );
};

export default HamburgerMenu;
 