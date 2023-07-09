import {
  Text, View,
  SafeAreaView, StatusBar, Image, StyleSheet, Keyboard
} from "react-native"
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { black, white, primaryColor, green, darkGreen, darkRed } from "../../utils/Colors";
import { IMAGES, image_back } from "../../utils/Images";
import AppTextInput from "../../common/AppTextInput";
import AppButton from "../../common/AppButton";

import OverlayActivityIndicator from "../../common/Loader";
import {
  isValidEmail, validateEmpty,
  validatePassword, validateName, validateNumber
} from '../../common/Validaton'
import Toast from "react-native-toast-message";
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';
import showCustomToast, { toastConfig } from "../../utils/Toastconfig";
import Header from "../../common/Header";
import { ERROR, SUCESS, USER_DATA } from "../../utils/AppConstant";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "../../redux/UserDataSlice";


export default function ChangePassword() {
  const [loading, setLoading] = useState(false);

  const [currentpassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const currentPasswordRef = React.useRef()
  const newPasswordRef = React.useRef()
  const confirmPasswordRef = React.useRef()

  const [currentPasswordError, setCurrentPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const navigation = useNavigation()
  const disptach = useDispatch();
  const userData = useSelector(state => state.userData)
  const [email, setEmail] = useState('')
  useEffect(() => {
    if (userData.data.email) {
      setEmail(userData.data.email)
      console.log('user passs---Data----11', userData.data)
    }
  },[email])



  const checkPasswordAndSaveUserData = () => {
    setLoading(true);
    firestore().collection('Users')
      .where('email', '==', email).where
      ('password', '==', currentpassword).get().then((querySnapshot) => {
        console.log(querySnapshot.docs)
        if (querySnapshot.docs.length > 0) {
            const data = querySnapshot.docs[0]._ref._documentPath._parts
          console.log('values...', querySnapshot.docs[0]._ref._documentPath._parts)
          const documentId = data[1]
          console.log('id---', documentId)
          updateUserPassword(documentId)

        } else {
          setLoading(false);
          showCustomToast(ERROR, 'Old Paasword is not correct.')


        }
      }).catch((error) => {
        setLoading(false);
        console.log(error)
        showCustomToast(ERROR, error)
      })

  }

  const updateUserPassword = (documentId) => {
    firestore().collection('Users').doc(documentId).update({
      password: `${newPassword}`,
    }).then((data) => {
      setLoading(false);
    
      saveJSONToAsyncStorage(USER_DATA)
    }).catch((error) => {
      setLoading(false);
      showCustomToast(ERROR, error)
      console.log(error)

    })
  }
  
  const saveJSONToAsyncStorage = async (key) => {
    try {
        AsyncStorage.getItem(key).then((data) => {
            // the string value read from AsyncStorage has been assigned to data
            // transform it back to an object
            data = JSON.parse(data);
            console.log('2', data)
            // update password value
            data.password = `${newPassword}`
            console.log('3', data)
            AsyncStorage.setItem(key, JSON.stringify(data));
            disptach(addUserData(data)) // update the redux userdata 
            showCustomToast(SUCESS, 'Password changes sucessfully.')
             setTimeout(() => {
                navigation.goBack()
            }, 1000);

        }
        )



    } catch (error) {
      showCustomToast(ERROR,'Error saving JSON value:'+error)
        console.log('Error saving JSON value:', error);
    }
};

  return (

    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={primaryColor} hidden={false}  />
      <Header
        leftIcon={image_back}
        title={'Change Password'}
        onClickLeftIcon={
          () => navigation.goBack()
        } isCartScreen={false} />

      {loading && <OverlayActivityIndicator />}
      <View style={{ flex: 1, marginHorizontal: 10, marginVertical: 50 }}>
        <AppTextInput placeholder={'Enter Current Password'}
          icon={IMAGES.image_password}

          isLast={false}
          isPassword={true}
          reference={currentPasswordRef}

          onSubmit={() => newPasswordRef.current.focus()}
          value={currentpassword} onChangeText={(text) => { setCurrentPassword(text) }}
        />
        {<Text style={[styles.errorText12]}>{currentPasswordError}</Text>}

        <AppTextInput placeholder={'Enter New Password'}
          icon={IMAGES.image_password}

          isLast={false}
          isPassword={true}
          reference={newPasswordRef}

          onSubmit={() => confirmPasswordRef.current.focus()}
          value={newPassword} onChangeText={(text) => { setNewPassword(text) }}
        />
        {<Text style={[styles.errorText12]}>{newPasswordError}</Text>}
        <AppTextInput placeholder={'Enter Confirm Password'}
          icon={IMAGES.image_password}

          isLast={true}
          isPassword={true}
          reference={confirmPasswordRef}
          onSubmit={() => Keyboard.dismiss()}
          value={confirmPassword} onChangeText={(text) => { setConfirmPassword(text) }}
        />
        {<Text style={[styles.errorText12]}>{confirmPasswordError}</Text>}
        <View style={{ marginTop: 50 }}>
          <AppButton title={'Change Password'} onPress={() => {
            if (validateEmpty(currentpassword)) {
              setCurrentPasswordError('Please enter current password')
            } else if (!validatePassword(currentpassword)) {
              setCurrentPasswordError('Please enter valid current password')
            } else if (validateEmpty(newPassword)) {
              setCurrentPasswordError('')
              setNewPasswordError('Please enter new password')
            } else if (!validatePassword(newPassword)) {
              setCurrentPasswordError('')
              setNewPasswordError('Please enter valid new password')
            }
            else if (validateEmpty(confirmPassword)) {
              setCurrentPasswordError('')
              setNewPasswordError('')
              setConfirmPasswordError('Please enter confirm password')
            } else if (currentpassword === newPassword) {
              setCurrentPasswordError('')
              setNewPasswordError('New password must be different from current password')
              setConfirmPasswordError('')
            }
            else if (newPassword !== confirmPassword) {
              setCurrentPasswordError('')
              setNewPasswordError('')
              setConfirmPasswordError('Confirm password and password must be same.')
            }
            else {
              setCurrentPasswordError('')
              setNewPasswordError('')
              setConfirmPasswordError('')
              Keyboard.dismiss()
              checkPasswordAndSaveUserData()
            }

          }} />
        </View>

      </View>
      <Toast config={toastConfig} />
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: darkGreen
    
  },

  errorText12: {
    fontSize: 13,
    color: darkRed,
    fontFamily: 'Raleway-Regular',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: 5,
    marginStart: 5
  },




})