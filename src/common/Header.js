import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { primaryColor, white } from '../utils/Colors';
const { height, width } = Dimensions.get('window');
import { useSelector } from "react-redux";

const Header = ({ title, leftIcon, rightIcon, onClickLeftIcon, onclickRightIcon, isCartScreen }) => {
  
// const cardData = useSelector(state => state.cartData)

//console.log('cart------->', cardData.data.length)
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.btn} onPress={() => onClickLeftIcon()}>
        <Image source={leftIcon} style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.btn} onPress={onclickRightIcon}>
        <Image source={rightIcon} style={styles.icon} />
      </TouchableOpacity>
      {/* {(isCartScreen ==false ||cardData.data.length==0) ? null : <View style={styles.uploadBackStyle}>
        <Text style={styles.countStyle}>{cardData.data.length}</Text>
      </View>} */}


    </View>
  );
}
export default Header;
const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 56,
    backgroundColor: primaryColor,
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 15, flexDirection: 'row'
  },
  btn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'

  },
  title: {
    color: white,
    fontSize: 20,
    fontFamily: 'Raleway-Black'

  },
  icon: {
    width: 30,
    height: 30,
    tintColor: white
  },

  uploadBackStyle: {
    width: 20,
    height: 20,
    backgroundColor: white,
    borderRadius: 10,
    alignContent: 'center',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: 8,
    top: 5,

  },
  countStyle: {
    color: primaryColor,
    fontSize: 12,
    fontFamily: 'Raleway-Black'

  },
}); 