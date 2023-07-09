import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { darkRed } from '../utils/Colors';

const OverlayActivityIndicator = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size={60} color={darkRed} style={{transform:[{scale:3}]}} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
 
   // marginTop:50,
    backgroundColor: '#00000000',
    zIndex: 1,
  },
});

export default OverlayActivityIndicator;