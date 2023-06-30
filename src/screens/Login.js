import { View, Text, StyleSheet, Image,Keyboard,
    Dimensions,SafeAreaView,ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect,useState } from 'react';
import { red, white, black } from "../utils/Colors";
import AppTextInput from "../common/AppTextInput";
import AppButton from "../common/AppButton";
import { useNavigation } from '@react-navigation/native'
import { isValidEmail, validateEmpty, validatePassword } from '../common/Validaton'

import OverlayActivityIndicator from "../common/Loader";
import { ForgotPasswordModal } from "../common/Dialogs";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { image_email,image_logo, image_password } from '../utils/Images';


const LoginScreen = () => {
    const navigation = useNavigation();
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false);

    const emailRef = React.useRef()
    const passwordRef = React.useRef()

    const [visible, setVisible] = useState(false)

    const [fogotPasswordEmail, setFogotPasswordEmail] = useState('')
    const [fogotPasswordEmailError, setFogotPasswordEmailError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const toastRef = React.useRef(null)




    useEffect(() => {
        GoogleSignin.configure({

         //   webClientId: '300110096690-qmb9sgt6837gi4p8t4pc8k4sn0trsujj.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)

        });
    })


    const displayLoader = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.navigate('Main')
        }, 5000);
    }

    const clearErrors = () => {
        setEmail('')
        setPassword('')
        setEmailError('')
        setPasswordError('')
    }
    const checkLoginData = () => {
        setLoading(true);
        firestore().collection('Users').where
            ('email', '==', email).get().then((querySnapshot) => {
                console.log(querySnapshot.docs)
                setLoading(false);
                if (querySnapshot.docs.length > 0) {
                    if (querySnapshot.docs[0]._data.email == email &&
                        querySnapshot.docs[0]._data.password == password) {
                       console.log('dataa---',JSON.stringify(querySnapshot.docs[0]._data))
                       saveJSONToAsyncStorage(USER_DATA,querySnapshot.docs[0]._data)
                    } else {
                       // showErrorToast('Email or password is incorrect.')
                    }
                } else {
                  //  showErrorToast('Account not found.')
                }
            }).catch((error) => {
                setLoading(false);
                console.log(error)
              //  showErrorToast(error)
              
            })
    }
    const saveJSONToAsyncStorage = async (key, data) => {
        try {
          const jsonData = JSON.stringify(data);
          await AsyncStorage.setItem(key, jsonData);
          console.log('JSON value saved successfully.');
           //navigation.navigate('Main')    
        } catch (error) {
          console.log('Error saving JSON value:', error);
        }
      };


    // Somewhere in your code
    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('Googleauth -->',userInfo)
            console.log('Googleauth -->',await GoogleSignin.isSignedIn())
            signOut()
            //setState({ userInfo });
        } catch (error) {
            console.log('Googleauth -->',error)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };

    const  signOut = async () => {
        try {
          await GoogleSignin.signOut();
          console.log('Googleauth -->',await GoogleSignin.isSignedIn())
        } catch (error) {
            console.log('Googleauth E -->',error)
          console.error(error);
        }
      };
    // return (<View style={styles.sectionContainer}>
    //     <TouchableOpacity onPress={() => {signIn() }}>
    //         <Text style={styles.text}>Login Screen </Text>
    //     </TouchableOpacity>

    // </View>)

    return (
            <SafeAreaView style={{flex:1,flexDirection:'column'}}  >
                {/* <StatusBar backgroundColor='#1AFf0000' translucent={true} showHideTransition={true} /> */}
                {loading && <OverlayActivityIndicator />}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ paddingHorizontal: 20 }}>
                        <Image source={image_logo} resizeMode="center" style={styles.image} />
                        <Text style={styles.heading}>
                            Login
                        </Text>
                        <View style={{ marginTop: 20 }} />
                        <AppTextInput placeholder={'Enter Email Id'} type={'email-address'}
                            icon={image_email} isLast={false} value={email}
                            onChangeText={(text) => { setEmail(text) }}
                            reference={emailRef}
                            onSubmit={() => passwordRef.current.focus()} />
                        {<Text style={[styles.errorText12]}>{emailError}</Text>}
                        <AppTextInput placeholder={'Enter Password'}
                            icon={image_password}
                            isLast={true} 
                            isPassword={true}
                            reference={passwordRef}
                            onSubmit={() => Keyboard.dismiss()}
                            value={password} onChangeText={(text) => { setPassword(text) }}
                        />
                        {<Text style={[styles.errorText12]}>{passwordError}</Text>}
                        <TouchableOpacity onPress={() => {
                            setFogotPasswordEmail('')
                            setFogotPasswordEmailError('')
                            setVisible(true)
                        }}>
                            <Text style={styles.forgotText}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        <View style={{ marginVertical: 20 }} />


                        <AppButton title={'Login'} onPress={() => {

                            if (validateEmpty(email)) {

                                setEmailError('Please enter Email')
                            } else if (!isValidEmail(email)) {
                                setEmailError('Please enter valid email')
                            } else if (validateEmpty(password)) {
                                setEmailError('')
                                setPasswordError('Please enter password')
                            } else if (!validatePassword(password)) {
                                setEmailError('')
                                setPasswordError('Please enter valid password')
                            }
                            else {
                                setEmailError('')
                                setPasswordError('')
                                checkLoginData()
                                //displayLoader()
                            }

                            signIn()

                        }} />

                        <View style={{
                            marginTop: 10, marginBottom: 20, flexDirection: 'row',
                            alignItems: 'center', alignContent: 'center', justifyContent: 'center'
                        }}>
                            <Text style={styles.alreadyText}>
                                Don't have Account ?
                            </Text>
                            <TouchableOpacity onPress={() => {
                                // toastRef.current.show({
                                //     type: 'warning',
                                //     text: 'Please enter Email',
                                //     duration: 2000
                                // });
                                clearErrors()
                                navigation.navigate('Signup')
                            }}>
                                <Text style={styles.signupText}>
                                    Signup
                                </Text>
                            </TouchableOpacity>


                        </View>
                    </View>


                </ScrollView>
                <ForgotPasswordModal modelVisible={visible} title={'Forgot Password?'}
                    yesText={'Submit'} onNoClick={() => {
                        setVisible(false)
                    }}
                    email={fogotPasswordEmail}
                    setEmail={setFogotPasswordEmail}
                    emailError={fogotPasswordEmailError}
                    setFogotPasswordEmailError={setFogotPasswordEmailError}
                    onYesClick={(emailId) => {
                        console.log('Email---' + emailId)
                        setVisible(false)
                        toastRef.current.show({
                            type: 'warning',
                            text: 'Please enter Email',
                            duration: 2000
                        });
                    }}
                />
            </SafeAreaView>
      

    );


}


const styles = StyleSheet.create({
    sectionContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        fontFamily: 'Raleway-Black'
    },

    heading: {
        fontSize: 50,
        color: red,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'Raleway-Black',
    },
    image: {
        alignSelf: 'center',
        width: 100, height: 100,
        borderRadius: 100 / 2, marginTop: 80,
        backgroundColor: 'yellow',
    },
    forgotText: {
        fontSize: 20,
        color: red,
        textAlign: 'right',
        marginTop: 20,
    },
    alreadyText: {
        fontSize: 20,
        color: black,
        fontFamily: 'Raleway-Regular',
    },
    signupText: {
        fontSize: 20,
        color: red,
        paddingHorizontal: 10,
        fontFamily: 'Raleway-Black',
        textDecorationLine: 'underline'
    },
    errorText12: {
        fontSize: 13,
        color: red,
        fontFamily: 'Raleway-Regular',
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginTop: 5,
        marginStart: 5


    },

});

export default LoginScreen











// {
//   "project_info": {
//     "project_number": "300110096690",
//     "project_id": "groceryapp-492e9",
//     "storage_bucket": "groceryapp-492e9.appspot.com"
//   },
//   "client": [
//     {
//       "client_info": {
//         "mobilesdk_app_id": "1:300110096690:android:ef9a33020c10eeb348cf2b",
//         "android_client_info": {
//           "package_name": "com.groceryapp"
//         }
//       },
//       "oauth_client": [
//         {
//           "client_id": "300110096690-qt9ja8opjptld8dja72rtf7m3susknjs.apps.googleusercontent.com",
//           "client_type": 3
//         }
//       ],
//       "api_key": [
//         {
//           "current_key": "AIzaSyCOt3OtNTVIPR6IDtd2GR6dyhU_rjSphZE"
//         }
//       ],
//       "services": {
//         "appinvite_service": {
//           "other_platform_oauth_client": [
//             {
//               "client_id": "300110096690-qt9ja8opjptld8dja72rtf7m3susknjs.apps.googleusercontent.com",
//               "client_type": 3
//             }
//           ]
//         }
//       }
//     }
//   ],
//   "configuration_version": "1"
// }