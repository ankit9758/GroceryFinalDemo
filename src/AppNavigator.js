import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoardingScreen from './screens/OnBoarding';
import OtpVerificationScreen from './screens/OtpVerification';
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/Signup';



const Stack = createNativeStackNavigator()
const AppNavigator = (props) => {

    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName={props.initalRoute}>

                <Stack.Screen name='Onboarding' component={OnBoardingScreen}
                    options={{ headerShown: false }} />

                <Stack.Screen name='OtpVerification' component={OtpVerificationScreen}
                    options={{ headerShown: false }} />
                <Stack.Screen name='Login' component={LoginScreen}
                    options={{ headerShown: false }} />
                <Stack.Screen name='SignUp' component={SignUpScreen}
                    options={{ headerShown: false }} />
            </Stack.Navigator>


        </NavigationContainer>


    );
}
export default AppNavigator;