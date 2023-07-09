import React from "react";
import { TouchableOpacity, Text, View, Image, TextInput } from "react-native"
import { white } from "../utils/Colors";

export default AppTextInput = ({ value, onChangeText, 
  placeholder, type, icon,isLast,onSubmit,reference,isPassword,maxLength,isEditable}) => (
  <View style={{
    width: '100%',
    height: 55,
    borderRadius: 10,
    borderWidth: 0.5,
    backgroundColor: white,
    marginTop: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center'
  }}>
    <Image source={icon} style={{ height: 24, width: 24 }} />
    <TextInput placeholder={placeholder} placeholderTextColor={'#000000'} style={{
      marginHorizontal: 10,flex:1 }} value={value} returnKeyType={isLast ? "done" : "next"}
      secureTextEntry={isPassword ? true : false}
      numberOfLines={1} onChangeText={onChangeText}
       keyboardType={type ? type : 'default'} 
       maxLength={maxLength}
       editable={isEditable}
      
      blurOnSubmit={false} onSubmitEditing={onSubmit}
      ref={reference}
      />
  </View>
);
