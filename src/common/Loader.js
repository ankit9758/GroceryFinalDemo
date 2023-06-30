import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const OverlayActivityIndicator = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator  size={70}  color="red"  />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:50,
    backgroundColor: 'rgba(255, 255, 255 )',
    zIndex: 9999,
  },
});

export default OverlayActivityIndicator;