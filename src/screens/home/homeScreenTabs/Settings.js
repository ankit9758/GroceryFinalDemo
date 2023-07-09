import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { white, black, primaryColor } from '../../../utils/Colors';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { ERROR, USER_DATA } from '../../../utils/AppConstant';

import { useNavigation } from '@react-navigation/native'

import { IMAGES } from '../../../utils/Images';
import ProfileItems from '../../../common/ProfileItems';
import { useDispatch, useSelector } from "react-redux";
import { SimpleModal } from '../../../common/Dialogs';
import { removeUserData } from '../../../redux/UserDataSlice';
import showCustomToast from '../../../utils/Toastconfig';

export default function Settings() {
  const disptach = useDispatch();
  const userData = useSelector(state => state.userData)
  const [visible, setVisible] = useState(false)

  const [imagePath, setImagePath] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const navigation = useNavigation();

  useEffect(() => {
    console.log('user---Data----', userData.data)
    if (userData.data.email) {
      // console.log('user---Data----11',userData)

      setName(userData.data['firstName'] + ' ' + userData.data['lastName'])
      setPhoneNumber(userData.data['phoneNumber']);
      setEmail(userData.data['email']);
      setImagePath(userData.data['imagePath'])
    }
  })

  const clearUserData = async (key) => {
    try {
      await AsyncStorage.removeItem(key)
      disptach(removeUserData(email))
      navigation.reset({
        key: 'Login',
        routes: [{ name: 'Login' }]
      })
    } catch (e) {
      showCustomToast(ERROR,e)
    }

    console.log('Done.')
  }

  return (
    <View>
      <ScrollView >
        <View style={stylesProfile.screenContainer}>
          <View style={stylesProfile.profileContainer}>
            <Image
              source={imagePath === '' ? IMAGES.image_no_data : { uri: imagePath }}

              style={{
                width: 120, height: 120, borderRadius: 120 / 2, alignSelf: 'center', backgroundColor: 'yellow', marginTop: 30,
                borderColor: primaryColor,
              }}
            />
            <View style={stylesProfile.profilePhotoContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')
                }>
                <View style={stylesProfile.uploadBackStyle}>
                  <Image
                    source={IMAGES.image_edit}
                    style={stylesProfile.uploadIconStyle}
                  />
                </View>

              </TouchableOpacity>
            </View>

          </View>
          <Text style={[stylesProfile.appTextBold20, { alignSelf: 'center', marginTop: 40, paddingHorizontal: 20 }]}>Name : {name} </Text>
          <Text style={[stylesProfile.appTextBold18, { alignSelf: 'center', marginTop: 5, paddingHorizontal: 20 }]}>Email : {email}</Text>
          <Text style={[stylesProfile.appTextBold16, { alignSelf: 'center', marginTop: 5, paddingHorizontal: 20 }]}>Phone : {phone} </Text>

          <View style={{ marginTop: 30, marginBottom: 80 }}>
            <ProfileItems leftIcon={IMAGES.image_address} title={'My Address'} onClick={() => {
              navigation.navigate('SavedAddress')
            }} />
            <ProfileItems leftIcon={IMAGES.image_cart} title={'My Chats'} onClick={() => { navigation.navigate('ChatList') }} />
            <ProfileItems leftIcon={IMAGES.image_password} title={'Change Password '} onClick={() => { navigation.navigate('ChangePassword') }} />
            <ProfileItems leftIcon={IMAGES.image_language} title={'Languages'} onClick={() => { navigation.navigate('BottomNavigation') }} />
            <ProfileItems leftIcon={IMAGES.image_logout} title={'Log out'} onClick={() => { setVisible(true) }} />
          </View>


        </View>
      </ScrollView>
      <SimpleModal modelVisible={visible} title={'Logout ?'} description={'Are you sure you want to Logout ?'}
        yesText={'Yes'} noText={'No'} onNoClick={() => {
          setVisible(false)
        }} onYesClick={() => {
          clearUserData(USER_DATA)
          setVisible(false)
        }}
      />
    </View>

  );
}

const stylesProfile = StyleSheet.create({
  screenContainer: {
    flex: 1,

  },
  profileContainer: {
    height: 120,
    width: 120,
    alignSelf: 'center'

  },
  appButtonText: {
    fontSize: 18,
    color: white,
    alignSelf: "center",
    textTransform: "none",
    fontFamily: 'Raleway-ExtraBold'
  },
  appTextBold64: {
    fontSize: 64,
    color: white,
    alignSelf: 'flex-start',
    fontFamily: 'Raleway-Black'

  },
  appButton: {
    padding: 12,
  },
  appTextBold18: {
    fontSize: 18,
    color: white,
    fontFamily: 'Raleway-Medium'


  },
  appTextBold20: {
    fontSize: 20,
    color: white,
    fontFamily: 'Raleway-Black'

  },
  appTextBold16: {
    fontSize: 16,
    color: white,
    fontFamily: 'Raleway-SemiBold'

  },
  profilePhotoContainer: {
    position: 'absolute',
    justifyContent: 'flex-end',
    right: -5,
    top: 110
  },
  uploadIconStyle: {
    width: 15,
    height: 15,
    tintColor: white
  },
  uploadBackStyle: {
    width: 30,
    height: 30,
    backgroundColor: primaryColor,
    borderRadius: 15,
    alignContent: 'center',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  }
})