import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoardingScreen from './screens/authentication/OnBoarding';
import OtpVerificationScreen from './screens/authentication/OtpVerification';
import LoginScreen from './screens/authentication/Login';
import SignUpScreen from './screens/authentication/Signup';
import Main from './screens/home/Main';
import ChangePassword from './screens/user/ChangePassword';
import AddAddress from './screens/address/AddAddress';
import SavedAddress from './screens/address/SavedAddress';
import EditProfile from './screens/user/EditProfile';



const Stack = createNativeStackNavigator()
const AppNavigator = (props) => {

    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName={props.initalRoute}>
                {/* <Stack.Navigator initialRouteName={'Login'}> */}
                <Stack.Screen name='Onboarding' component={OnBoardingScreen}
                    options={{ headerShown: false }} />

                <Stack.Screen name='OtpVerification' component={OtpVerificationScreen}
                    options={{ headerShown: true, title: '' }} />
                <Stack.Screen name='Login' component={LoginScreen}
                    options={{ headerShown: false }} />
                <Stack.Screen name='Signup' component={SignUpScreen}
                    options={{ headerShown: true, title: '' }} />
                <Stack.Screen name='Main' component={Main}
                    options={{ headerShown: false }} />
                <Stack.Screen name='ChangePassword' component={ChangePassword}
                    options={{ headerShown: false }} />

                <Stack.Screen name='SavedAddress' component={SavedAddress}
                    options={{ headerShown: false }} />
                <Stack.Screen name='AddAddress' component={AddAddress}
                    options={{ headerShown: false }} />

                <Stack.Screen name='EditProfile' component={EditProfile}
                    options={{ headerShown: false }} />

            </Stack.Navigator>


        </NavigationContainer>


    );
}
export default AppNavigator;