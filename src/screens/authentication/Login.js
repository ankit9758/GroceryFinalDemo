import {
    View, Text, StyleSheet, Image, Keyboard,
    Dimensions, SafeAreaView, ScrollView, TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { primaryColor, white, black, darkRed, blue } from "../../utils/Colors";
import AppTextInput from "../../common/AppTextInput";
import AppButton from "../../common/AppButton";
import { useNavigation } from '@react-navigation/native'
import { isValidEmail, returnFilterValue, validateEmpty, validatePassword } from '../../common/Validaton'

import OverlayActivityIndicator from "../../common/Loader";
import { ForgotPasswordModal } from "../../common/Dialogs";
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { image_email, image_facebook, image_google, image_logo, image_password } from '../../utils/Images';
import Toast from "react-native-toast-message";
import showCustomToast, { toastConfig } from "../../utils/Toastconfig";
import { ERROR, SUCESS, USER_DATA } from '../../utils/AppConstant';
import SocialButton from '../../common/SocialButton';
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from '../../redux/UserDataSlice';


const LoginScreen = () => {
    const disptach = useDispatch();
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

    const [socialData, setSocialData] = useState({})

    const userData = useSelector(state => state.userData)

    useEffect(() => {
        console.log('login--user---Data----', userData.data)
        GoogleSignin.configure({

            //   webClientId: '300110096690-qmb9sgt6837gi4p8t4pc8k4sn0trsujj.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)

        });
    },[])
    useEffect(() => {

        if (socialData.socialEmail) {
            console.log('socialemail', socialData)
            checkLoginData(true, socialData.socialEmail)
        }
    }, [socialData])

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


    const checkLoginData = (isSocialLogin, emailId) => {
        console.log('socialemail', socialData)
        setLoading(true);
        firestore().collection('Users').where
            ('email', '==', emailId).get().then((querySnapshot) => {
                console.log(querySnapshot.docs)
                setLoading(false);
                if (querySnapshot.docs.length > 0) {
                    if (isSocialLogin) {
                        console.log('socialId', socialData)
                        if (socialData.socialId !== '' && querySnapshot.docs[0]._data.email == emailId &&
                            querySnapshot.docs[0]._data.socialId == socialData.socialId) {
                            signOut() //signout sucessfully
                            showCustomToast(SUCESS, 'Login Sucessfully.')
                            console.log('dataa---Social', JSON.stringify(querySnapshot.docs[0]._data))
                            saveJSONToAsyncStorage(USER_DATA, querySnapshot.docs[0]._data)
                        } else {
                            showCustomToast(ERROR, 'Social login email  is incorrect.')
                        }
                    } else {
                        if (querySnapshot.docs[0]._data.email == emailId &&
                            querySnapshot.docs[0]._data.password == password) {
                            console.log('dataa---', JSON.stringify(querySnapshot.docs[0]._data))
                            showCustomToast(SUCESS, 'Login Sucessfully.')
                            saveJSONToAsyncStorage(USER_DATA, querySnapshot.docs[0]._data)
                        } else {
                            showCustomToast(ERROR, 'Email or password is incorrect.')

                        }
                    }

                } else {
                    showCustomToast(ERROR, 'Account not found.')

                }
            }).catch((error) => {
                setLoading(false);
                console.log(error)
                showCustomToast(ERROR, error)


            })
    }

    const saveJSONToAsyncStorage = async (key, data) => {
        try {
            const jsonData = JSON.stringify(data);
            await AsyncStorage.setItem(key, jsonData);
            console.log('JSON value saved successfully.');
            disptach(addUserData(data))
            navigation.navigate('Main')
           // navigation.navigate('Signup')
        } catch (error) {
            showCustomToast(ERROR, 'Error saving JSON value:' + error)
            console.log('Error saving JSON value:', error);
        }
    };

    // Somewhere in your code
    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('google data ', userInfo)
            setSocialData({ 'socialId': returnFilterValue(userInfo.user.id), 'socialEmail': returnFilterValue(userInfo.user.email) })


        } catch (error) {
            showCustomToast(ERROR, 'Google Sign in error:' + error)
            console.log('google data error', error)
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
    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            // Remember to remove the user from your app's state as well
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, flexDirection: 'column',backgroundColor:white }}  >
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
                            checkLoginData(false, email)
                        }



                    }} />
                    <Text style={{
                        textAlign: 'center', marginVertical: 10,
                        fontSize: 14, color: '#383838', fontFamily: 'Raleway-Regular'
                    }}>----or Login with---- </Text>

                    <SocialButton onPress={() => signIn()} textColor={darkRed}
                        title={'LOGIN WITH GOOGLE'} icon={image_google} />
                    <SocialButton onPress={() => { }} textColor={blue}
                        title={'LOGIN WITH FACEBOOK'} icon={image_facebook} />

                    <View style={{
                        marginTop: 10, marginBottom: 20, flexDirection: 'row',
                        alignItems: 'center', alignContent: 'center', justifyContent: 'center'
                    }}>
                        <Text style={styles.alreadyText}>
                            Don't have Account ?
                        </Text>
                        <TouchableOpacity onPress={() => {
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
            <Toast config={toastConfig} />
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
                    showCustomToast(SUCESS, emailId)
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
        color: primaryColor,
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
        color: primaryColor,
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
        color: primaryColor,
        paddingHorizontal: 10,
        fontFamily: 'Raleway-Black',
        textDecorationLine: 'underline'
    },
    errorText12: {
        fontSize: 13,
        color: primaryColor,
        fontFamily: 'Raleway-Regular',
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginTop: 5,
        marginStart: 5


    },

});

export default LoginScreen