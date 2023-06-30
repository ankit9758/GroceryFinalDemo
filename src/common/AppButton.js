import React from "react";
import { TouchableOpacity, Text, View } from "react-native"
import stylesApp from '../utils/styles';

export default CustomButton = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={stylesApp.appButtonContainer} >
      <Text style={[stylesApp.appButtonText]}>{title}</Text>
    </View>
  </TouchableOpacity>
);
