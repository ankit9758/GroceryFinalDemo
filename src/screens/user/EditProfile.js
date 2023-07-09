import { Alert, Image, Keyboard, Linking, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef, useEffect, useContext } from "react";
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../common/Header'
import OverlayActivityIndicator from "../../common/Loader";
import { useRoute, useNavigation } from '@react-navigation/native'
import { IMAGES } from '../../utils/Images';
import {
  isValidEmail, validateEmpty,
  validatePassword, validateName,
  validateNumber, returnFilterValue
} from '../../common/Validaton'
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import { request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { black, darkGreen, darkRed, primaryColor, white } from '../../utils/Colors';
import AppTextInput from '../../common/AppTextInput';
import AppButton from '../../common/AppButton';
import showCustomToast, { toastConfig } from '../../utils/Toastconfig';
import { ERROR, SUCESS, USER_DATA } from '../../utils/AppConstant';
import  Toast  from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { addUserData } from '../../redux/UserDataSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../utils/ThemeContext';

export default function EditProfile() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')

  const navigation = useNavigation()


  const [showCameraGallery, setShowCameraGallery] = useState(false);


  const firstNameRef = React.useRef()
  const lastNameRef = React.useRef()
  const phoneNumberRef = React.useRef()
  const emailRef = React.useRef()
  const passwordRef = React.useRef()
  const confirmPasswordRef = React.useRef()

  const [visible, setVisible] = useState(false)

  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [firstNameError, setFirstNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [imageUri, setImageUri] = useState('')
  const [socialId, setSocialId] = useState('')
  const [userId, setUserId] = useState('')
  const [accountType, setAccountType] = useState('')

  const close = () => setVisible(false);
  const open = () => setVisible(true)

  const [loading, setLoading] = useState(false);
  const disptach = useDispatch();

  const userData = useSelector(state => state.userData)


  const { theme, user } = useContext(ThemeContext);

  useEffect(() => {
    if (userData.data.email) {
      setEmail(userData.data.email)
      setFirstName(userData.data.firstName)
      setLastName(userData.data.lastName)
      setPhoneNumber(userData.data.phoneNumber);
      setImageUri(userData.data.imagePath)
      setPassword(userData.data.password)
      setConfirmPassword(userData.data.password)
      setSocialId(userData.data.socialId)
      setUserId(userData.data.userId)
      setAccountType(userData.data.accountType)
      console.log('user----11', userData.data)
    }
  },[email])





  const checkEmailAndSaveUserData = () => {
    setLoading(true);
    firestore().collection('Users').where
      ('email', '==', email).get().then((querySnapshot) => {
        console.log(querySnapshot.docs)
       
        if (querySnapshot.docs.length > 0) {
          const data = querySnapshot.docs[0]._ref._documentPath._parts
          console.log('values...', querySnapshot.docs[0]._ref._documentPath._parts)
          const documentId = data[1]
          console.log('id---', documentId)
          updateUserProfile(documentId)
        } else {
          customToaast(ERROR, 'Please check your information.')
          setLoading(false);
        }
      }).catch((error) => {
        setLoading(false);
        console.log(error)
        showCustomToast(ERROR, error)

      })
  }


  const updateUserProfile = (documentId) => {
    const jsonData = {
      'firstName': `${firstName}`,
      'lastName': `${lastName}`,
      'phoneNumber': `${phone}`,
      'email': `${email}`,
      'imagePath': `${imageUri}`,
      'password': `${password}`,
      'socialId': `${socialId}`,
      'accountType':`${accountType}`,
      'userId': `${userId}`,
    }
    console.log('Hello-->', jsonData)

    firestore().collection('Users').doc(documentId).update(jsonData).then((data) => {
       setLoading(false);
       
       saveJSONToAsyncStorage(USER_DATA,jsonData)
    }).catch((error) => {
      setLoading(false);
      showCustomToast(ERROR, error)
      console.log(error)

    })
  }


  const saveJSONToAsyncStorage = async (key, data) => {
    try {
        const jsonData = JSON.stringify(data);
        await AsyncStorage.setItem(key, jsonData);
        console.log('JSON value saved successfully.');

     //   user.updateUserData(data)

        disptach(addUserData(data))
        showCustomToast(SUCESS, 'Profile  changes sucessfully.')
        setTimeout(() => {
          navigation.goBack()
      }, 1000);

    } catch (error) {
      showCustomToast(ERROR,'Error saving JSON value:'+error)
        console.log('Error saving JSON value:', error);
    }
};

  const clearErrors = () => {
    setFirstNameError('')
    setLastNameError('')
    setPhoneError('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
  }

  const pickPicture = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setShowCameraGallery(false)
      console.log(image)
      setImageUri(image.path);
    });
  };
  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true
    }).then(image => {
      setShowCameraGallery(false)
      console.log(image)
      uploadImage(image.path)
    })
      .finally(close);
  };

  const uploadImage = async (imagePath) => {
    setLoading(true)
    const fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1)
    const reference = storage().ref(fileName)
    const pathToFile = imagePath
    //upload file 
    await reference.putFile(pathToFile).then(() => {
      getImagePath(fileName)
    }).catch((error) => {
      setLoading(false)
      showCustomToast(ERROR, error)
    });
  };
  const getImagePath = async (fileName) => {
    const url = await storage().ref(fileName).getDownloadURL().then((data) => {
      setLoading(false)
      setImageUri(data)
      // console.log(data)
    }).catch((error) => {
      setLoading(false)
      showCustomToast(ERROR, error)

    });
  };


  const checkCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
        const granted = await PermissionsAndroid.request(permission);
        console.log(granted)
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          openCamera()
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          handlePermissionDenied();
        } else {
          showCustomToast(ERROR, 'Camera permission denied')


          console.log('Camera permission denied');
        }
      } else if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.CAMERA);
        if (result === RESULTS.GRANTED) {
          openCamera()
          console.log('Camera permission granted');
        } else if (granted === RESULTS.DENIED) {
          handlePermissionDenied();
        }
        else {
          showCustomToast(ERROR, 'Camera permission denied')

          console.log('Camera permission denied');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePermissionDenied = () => {
    Alert.alert(
      'Permission Required',
      'To use the camera, you need to grant camera access. Please go to app settings and enable the camera permission.',
      [
        { text: 'Cancel', style: 'cancel', onPress: openCancel },
        { text: 'Open Settings', onPress: openAppSettings },
      ]
    );
  };
  const openCancel = () => {
    showCustomToast(ERROR, 'Camera permission denied')
  };
  const openAppSettings = () => {
    if (Platform.OS === 'android') {
      // Open app settings for Android
      openSettings()
    } else if (Platform.OS === 'ios') {
      // Open app settings for iOS
      Linking.openURL('app-settings:');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={primaryColor} />
      <Header
        leftIcon={IMAGES.image_back}
        title={'Edit Profile'}
        onClickLeftIcon={
          () => navigation.goBack()
        } isCartScreen={false}
      />
      <ScrollView showsVerticalScrollIndicator={false} scrollsToTop>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.profileContainer}>
            <Image
              source={imageUri === '' ? IMAGES.image_no_data : { uri: imageUri }}
              style={{
                width: 120, height: 120, borderRadius: 120 / 2, alignSelf: 'center', backgroundColor: 'yellow', marginTop: 30,
                borderColor: primaryColor
              }}
            />
            <View style={styles.profilePhotoContainer}>
              <TouchableOpacity
                onPress={() => setShowCameraGallery(true)
                }>
                <View style={styles.uploadBackStyle}>
                  <Image
                    source={IMAGES.image_edit}
                    style={styles.uploadIconStyle}
                  />
                </View>

              </TouchableOpacity>
            </View>

          </View>

          <View style={{ marginTop: 20 }} />

          <AppTextInput placeholder={'Enter First Name'} type={'default'}
            icon={IMAGES.image_name} isLast={false} value={firstName}
            onChangeText={(text) => { setFirstName(text) }}
            reference={firstNameRef}
            onSubmit={() => lastNameRef.current.focus()} />
          {<Text style={[styles.errorText12]}>{firstNameError}</Text>}

          <AppTextInput placeholder={'Enter Last Name'} type={'default'}
            icon={IMAGES.image_name} isLast={false} value={lastName}
            onChangeText={(text) => { setLastName(text) }}
            reference={lastNameRef}
            onSubmit={() => phoneNumberRef.current.focus()} />
          {<Text style={[styles.errorText12]}>{lastNameError}</Text>}



          <AppTextInput placeholder={'Enter Email Id'} type={'email-address'}
            icon={IMAGES.image_email} isLast={false} value={email}
            onChangeText={(text) => { setEmail(text) }}
            reference={emailRef}
            isEditable={false}
            onSubmit={() => phoneNumberRef.current.focus()} />
          {<Text style={[styles.errorText12]}>{emailError}</Text>}

          <AppTextInput placeholder={'Enter Phone Number'} type={'numeric'}
            icon={IMAGES.image_phone} isLast={false} value={phone}
            onChangeText={(text) => { setPhoneNumber(text.replace(/[^0-9]/g, '')) }}
            reference={phoneNumberRef}
            isPhone={true}
            maxLength={10}
            onSubmit={() => passwordRef.current.focus()} />
          {<Text style={[styles.errorText12]}>{phoneError}</Text>}

          <AppTextInput placeholder={'Enter Password'}
            icon={IMAGES.image_password}
            isLast={false}
            reference={passwordRef}
            isPassword={true}
            onSubmit={() => confirmPasswordRef.current.focus()}
            value={password} onChangeText={(text) => { setPassword(text) }}
          />
          {<Text style={[styles.errorText12]}>{passwordError}</Text>}

          <AppTextInput placeholder={'Enter Confirm Password'}
            icon={IMAGES.image_password}
            isLast={true} isPassword={true}
            reference={confirmPasswordRef}
            onSubmit={() => Keyboard.dismiss()}
            value={confirmPassword} onChangeText={(text) => { setConfirmPassword(text) }}
          />
          {<Text style={[styles.errorText12]}>{confirmPasswordError}</Text>}


          <View style={{ marginVertical: 0 }} />


          <AppButton title={'Update Profile'} onPress={() => {
            if (validateEmpty(firstName)) {
              setFirstNameError('Please enter first name')
            } else if (!validateName(firstName)) {
              setFirstNameError('Please enter valid first name')
            } else if (validateEmpty(lastName)) {
              setFirstNameError('')
              setLastNameError('Please enter last name')
            } else if (!validateName(lastName)) {
              setFirstNameError('')
              setLastNameError('Please enter valid last name')
            } else if (validateEmpty(email)) {
              setFirstNameError('')
              setLastNameError('')
              setEmailError('Please enter Email')
            } else if (!isValidEmail(email)) {
              setFirstNameError('')
              setLastNameError('')
              setEmailError('Please enter valid email')
            }
            else if (validateEmpty(phone)) {
              setFirstNameError('')
              setLastNameError('')
              setEmailError('')
              setPhoneError('Please enter phone number')
            } else if (!validateNumber(phone)) {
              setFirstNameError('')
              setLastNameError('')
              setEmailError('')
              setPhoneError('Please enter valid phone number')
            } else if (validateEmpty(password)) {
              setFirstNameError('')
              setLastNameError('')
              setEmailError('')
              setPhoneError('')
              setPasswordError('Please enter password')
            } else if (!validatePassword(password)) {
              setFirstNameError('')
              setLastNameError('')
              setEmailError('')
              setPhoneError('')
              setPasswordError('Please enter valid password')
            } else if (validateEmpty(confirmPassword)) {
              setFirstNameError('')
              setLastNameError('')
              setEmailError('')
              setPhoneError('')
              setPasswordError('')
              setConfirmPasswordError('Please enter confirm password')
            } else if (password !== confirmPassword) {
              setFirstNameError('')
              setLastNameError('')
              setEmailError('')
              setPhoneError('')
              setPasswordError('')
              setConfirmPasswordError('confirm password and password must be same.')
            }
            else {
              setFirstNameError('')
              setLastNameError('')
              setEmailError('')
              setPhoneError('')
              setPasswordError('')
              setConfirmPasswordError('')
              checkEmailAndSaveUserData()
            }

          }} />

        </View>


      </ScrollView>
      <Modal style={{
        width: '100%', marginLeft: 0,
        marginTop: 0,
        marginBottom: 0, marginEnd: 0
      }}
        hasBackdrop={true}
        onBackdropPress={() => setShowCameraGallery(false)}
        animationInTiming={1000} animationOutTiming={1000}
        isVisible={showCameraGallery}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        onBackButtonPress={() => setShowCameraGallery(false)
        }
        onSwipeComplete={() => setShowCameraGallery(false)}
        swipeDirection={'down'}

      >
        <View style={{
          position: 'absolute', bottom: 0,
          backgroundColor: white,
          alignItems: 'center',
          paddingBottom: 40,
          paddingHorizontal: 20,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 20, left: 0, right: 0
        }}>

          <Text style={styles.bottomTitleText}>Upload Photos</Text>
          <Text style={styles.bottomDescText}>Choose Your Profile Picture </Text>
          <TouchableOpacity style={styles.bottombuton} onPress={() => {
            checkCameraPermission()
            setShowCameraGallery(false)
          }
          }>
            <Text style={styles.bottomButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottombuton} onPress={() => {
            pickPicture()

          }}>
            <Text style={styles.bottomButtonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottombuton} onPress={() => { setShowCameraGallery(false) }}>
            <Text style={styles.bottomButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>


      </Modal>

      <Toast config={toastConfig} />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  image: {
    alignSelf: 'center',
    width: 100, height: 100,
    borderRadius: 100 / 2, marginTop: 80,
    backgroundColor: 'yellow',
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
  },
  bottomTitleText: {
    marginTop: 30,
    fontSize: 24,
    color: black,
    fontFamily: 'Raleway-Black',

  },
  bottomDescText: {
    fontSize: 16,
    color: black,
    fontFamily: 'Raleway-Regular',
    marginBottom: 20,
  },
  bottomButtonText: {
    fontSize: 20,
    color: white,
    fontFamily: 'Raleway-Regular'
  },
  profileContainer: {
    height: 120,
    width: 120,
    alignSelf: 'center',
    marginVertical: 40


  },
  bottombuton: {
    width: '100%', marginTop: 10,
    backgroundColor: primaryColor,
    paddingVertical: 12,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  }
})