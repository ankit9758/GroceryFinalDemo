import {
    TouchableOpacity, Text, View, StyleSheet, SafeAreaView, StatusBar, TextInput, Keyboard
} from "react-native"
import React, { useState, useRef, useEffect } from "react";
import { black, blue, green, grey, primaryColor, white } from "../../utils/Colors"
import Header from "../../common/Header"
import { image_back } from "../../utils/Images"
import firestore from '@react-native-firebase/firestore';

import { useNavigation, useRoute } from '@react-navigation/native'
import Toast from "react-native-toast-message";
import customToaast, { toastConfig } from "../../utils/Toastconfig";
import { ERROR, NORMAL, SOCIAL, SUCESS, USER_DATA } from "../../utils/AppConstant";
import OverlayActivityIndicator from "../../common/Loader";
import uuid from 'react-native-uuid';
import AsyncStorage from "@react-native-async-storage/async-storage";
import showCustomToast from "../../utils/Toastconfig";


import { useDispatch } from "react-redux";
import { addUserData } from '../redux/UserDataSlice';


const OtpVerification = () => {
    const disptach = useDispatch();
    const navigation = useNavigation()
    const firstNumberRef = useRef()
    const secondNumberRef = useRef()
    const thirdNumberRef = useRef()
    const forthNumberRef = useRef()

    const [firstNumber, setFirstNumber] = useState('')
    const [secondNumber, setSecondNumber] = useState('')
    const [thirdNumber, setThirdNumber] = useState('')
    const [fouthNumber, setFouthNumber] = useState('')

    const [genrateOtp, setGenerateOtp] = useState('')
    const [isGenrateOtp, setIsGenerateOtp] = useState(0)

    const [timerCount, setTimerCount] = useState(5)
    const [loading, setLoading] = useState(false);

    const [isInputFocusedPosition, setIsInputFocusedPostion] = useState(0);
    const [userData, setUserData] = useState({})
    const route = useRoute()
    useEffect(() => {
        setUserData(route.params.data)
        generateRandomNumber()
    }, [isGenrateOtp])

    useEffect(() => {

        const interval = setInterval(() => {
            if (timerCount == 0) {
                clearInterval(interval)
            } else {
                setTimerCount(timerCount - 1)
            }
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [timerCount]);




    const saveUserData = () => {
        setLoading(true);
        const accountType = userData.socialId != '' ? SOCIAL : NORMAL

        console.log(userData);

        const abc = {
            'firstName': userData.firstName,
            'lastName': userData.lastName,
            'phoneNumber': userData.phoneNumber,
            'email': userData.email,
            'password': userData.password,
            'imagePath': userData.imagePath,
            'socialId': userData.socialId,
            'accountType': accountType,
            'userId': uuid.v4()
        }
        console.log('specialData ', abc);
        firestore().collection('Users').add(
            abc
        ).then((data) => {
            setLoading(false);
            showCustomToast(SUCESS, 'Account created Sucessfully.')

            // console.log(data);
            saveJSONToAsyncStorage(USER_DATA,
                abc
            )


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
            disptach(addUserData(data))
            navigation.navigate('Main')


        } catch (error) {
            console.log('Error saving JSON value:', error);
        }
    };

    const generateRandomNumber = () => {
        const min = 1000;
        const max = 9999;
        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
        console.log('Otpp--->', randomNumber)
        setGenerateOtp(randomNumber);
        showCustomToast(SUCESS, `Otp ${randomNumber} sent suceesully.`)
    };

    const checkAndVerifyOtp = () => {
        const enterdOTP = firstNumber + secondNumber + thirdNumber + fouthNumber
        console.log('entered Otp', enterdOTP)
        if (genrateOtp == enterdOTP) {
            saveUserData()
            // customToaast(SUCESS, `Otp verified suceesully.`)
        } else {
            showCustomToast(ERROR, `Please enter correct code.`)
        }
        //  
    };

    const handleKeyPress = ({ nativeEvent: { key: keyValue } }) => {
        if (!isNaN(keyValue)) {
            console.log(keyValue);
            //console.log('current Focus ',firstNumber.length);

            if (isInputFocusedPosition == 1 && firstNumber.length == 1) {
                secondNumberRef.current.focus()
                setSecondNumber(keyValue)
            } else if (isInputFocusedPosition == 2 && secondNumber.length == 1) {
                thirdNumberRef.current.focus()
                setThirdNumber(keyValue)
            } else if (isInputFocusedPosition == 3 && thirdNumber.length == 1) {
                forthNumberRef.current.focus()
                setFouthNumber(keyValue)
            }

        } else {
            console.log("wrong enter");
        }
    };
    return (<SafeAreaView style={{ flex: 1, backgroundColor: white, flexDirection: 'column' }}>
        <StatusBar translucent={false} backgroundColor={primaryColor} />
        {loading && <OverlayActivityIndicator />}
        <Header
            leftIcon={image_back}
            title={'Otp Veriifcation'}
            onClickLeftIcon={
                () => navigation.goBack()
            } isCartScreen={false} />
        <View style={{
            flex: 1, flexDirection: 'column',
            //   justifyContent: 'center',
            marginVertical: 100,
            paddingHorizontal: 45
        }}>

            <Text style={{

                fontSize: 16,
                color: black, fontFamily: 'Raleway-Regular',
            }}>
                Please check your phone,a verification code is sent to
                <Text style={{ fontSize: 24, color: primaryColor, fontFamily: 'Raleway-Black' }}>  {userData.phoneNumber}</Text>
            </Text>


            <Text style={{
                marginTop: 40,
                fontSize: 30,
                color: black,
                textAlign: 'left',
                fontFamily: 'Raleway-Black',
            }}>
                OTP Code
            </Text>
            <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between' }}>
                <TextInput ref={firstNumberRef}
                    onFocus={() => setIsInputFocusedPostion(1)}
                    value={firstNumber}
                    onKeyPress={handleKeyPress}
                    onChangeText={(text) => {
                        const withoutSpecialCharacter = text.replace(/[^0-9]/g, '').trim()
                        setFirstNumber(withoutSpecialCharacter)
                        if (withoutSpecialCharacter.length == 1) {
                            secondNumberRef.current.focus()
                        }
                    }}
                    maxLength={1}
                    returnKeyType="next"
                    keyboardType="number-pad"
                    style={styles.inputView} />
                <TextInput ref={secondNumberRef}
                    value={secondNumber}
                    onFocus={() => setIsInputFocusedPostion(2)}
                    onKeyPress={handleKeyPress}
                    onChangeText={(text) => {
                        const withoutSpecialCharacter = text.replace(/[^0-9]/g, '').trim()
                        setSecondNumber(withoutSpecialCharacter)
                        if (withoutSpecialCharacter.length == 1) {
                            thirdNumberRef.current.focus()
                        } else {
                            firstNumberRef.current.focus()
                        }
                    }}
                    maxLength={1}

                    returnKeyType="next"
                    keyboardType="number-pad"
                    style={styles.inputView} />
                <TextInput ref={thirdNumberRef}
                    maxLength={1}
                    onFocus={() => setIsInputFocusedPostion(3)}
                    onKeyPress={handleKeyPress}
                    value={thirdNumber}
                    onChangeText={(text) => {
                        const withoutSpecialCharacter = text.replace(/[^0-9]/g, '').trim()
                        setThirdNumber(withoutSpecialCharacter)
                        if (withoutSpecialCharacter.length == 1) {
                            forthNumberRef.current.focus()
                        } else {
                            secondNumberRef.current.focus()
                        }
                    }}
                    returnKeyType="next"
                    keyboardType="number-pad"
                    style={styles.inputView} />
                <TextInput ref={forthNumberRef}
                    maxLength={1}
                    onFocus={() => setIsInputFocusedPostion(4)}
                    onKeyPress={handleKeyPress}
                    value={fouthNumber}
                    onChangeText={(text) => {
                        const withoutSpecialCharacter = text.replace(/[^0-9]/g, '').trim()
                        setFouthNumber(withoutSpecialCharacter)
                        if (withoutSpecialCharacter.length == 0) {
                            thirdNumberRef.current.focus()
                        }
                    }}
                    returnKeyType="done"
                    keyboardType="number-pad"
                    style={styles.inputView} />
            </View>
            <TouchableOpacity
                disabled={firstNumber != "" && secondNumber != "" && thirdNumber != "" && fouthNumber != "" ? false : true}
                onPress={() => { checkAndVerifyOtp() }}>
                <View style={[styles.appButtonContainer,
                { backgroundColor: firstNumber != "" && secondNumber != "" && thirdNumber != "" && fouthNumber != "" ? primaryColor : grey }]} >
                    <Text style={[styles.appButtonText]}>Verify</Text>
                </View>
            </TouchableOpacity>
            <View style={{ width: '100%', marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity disabled={timerCount == 0 ? false : true}
                    onPress={() => {
                        Keyboard.dismiss()
                        setIsGenerateOtp(isGenrateOtp + 1)
                        setTimerCount(5)
                    }
                    }>
                    <Text
                        style={{
                            fontSize: timerCount == 0 ? 20 : 16,
                            // color: timerCount == 0 ? red : '#5A5A5A',
                            textAlign: 'center',
                            textDecorationLine: timerCount == 0 ? 'underline' : 'none',
                            fontFamily: timerCount == 0 ? 'Raleway-Black' : 'Raleway-Regular',
                        }}  >
                        {timerCount == 0 ? 'Send Code' : 'Resend code in'}
                    </Text>
                </TouchableOpacity>


                {
                    timerCount > 0 ? (<Text style={{
                        fontSize: 16,
                        color: black,
                        textAlign: 'center',
                        fontFamily: 'Raleway-Regular',
                    }}>
                        `00:{timerCount >= 10 ? timerCount : '0' + timerCount}`
                    </Text>) : null
                }

            </View>


        </View>
        <Toast config={toastConfig} />
    </SafeAreaView>
    )
}
export default OtpVerification



const styles = StyleSheet.create({
    inputView: {
        fontSize: 20,
        color: black,
        borderColor: primaryColor,
        borderRadius: 10,
        borderWidth: 1,
        height: 60,
        width: 60,
        textAlign: 'center',
        // alignItems: 'center',
        // justifyContent: 'center',
        // alignContent: 'center',
        fontFamily: 'Raleway-SemiBold'
    },

    appButtonContainer: {
        backgroundColor: primaryColor,
        elevation: 8,
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 12,
        marginTop: 20,
        elevation: 5
    },
    appButtonText: {
        fontSize: 18,
        color: white,
        alignSelf: "center",
        textTransform: "none",
        fontFamily: 'Raleway-ExtraBold'
    },

})