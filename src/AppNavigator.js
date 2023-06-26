import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoardingScreen from './screens/OnBoarding';



const Stack = createNativeStackNavigator()
const AppNavigator = (props) => {

    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName={props.initalRoute}>

             <Stack.Screen name='Onboarding' component={OnBoardingScreen}
                    options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>


    );
}
export default AppNavigator;