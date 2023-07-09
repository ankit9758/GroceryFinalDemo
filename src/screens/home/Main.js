
import {
  Text, View, Image, StyleSheet, Platform
} from "react-native"
import React, { useState, useRef, useEffect, useContext } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { green, primaryColor, white, black } from "../../utils/Colors";
import { IMAGES, image_add, image_city, image_home, image_sucess, image_wishlist } from "../../utils/Images";

import Header from "../../common/Header";
import Home from "./homeScreenTabs/Home";
import Search from "./homeScreenTabs/Search";
import AddProducts from "./homeScreenTabs/AddProducts";
import Settings from "./homeScreenTabs/Settings";
import WishList from "./homeScreenTabs/WishList";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { ThemeContext } from "../../utils/ThemeContext";
import { addUserData } from "../../redux/UserDataSlice";
const Tab = createBottomTabNavigator();


const BottomNavigaiton = () => {
  const disptach = useDispatch();
  const { theme, userData } = useContext(ThemeContext);

  useEffect(() => {
    if(userData.email){
        console.log('Main....',theme.mode+",,,,"+JSON.stringify(userData))
        disptach(addUserData(userData))
    }
    
})
  return (



  <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: false, tabBarStyle: {
        //   position: 'absolute',
        //     bottom: 20,
        // left: 10,
        // right: 10,
        elevation: 0,
        //borderRadius: 10,
        height:  Platform.OS === 'ios' ? 110 : 70,
        backgroundColor: primaryColor,
      
      },
    
      headerTintColor:white,
      headerTitleAlign:'center',
      headerTitleStyle:{
        fontSize:30,
        // fontWeight: '200',
        // fontWeight:700,
        fontFamily:'Raleway-Regular' 
      },
      
      headerStyle:styles.bottomTabTopIcon,
     headerShadowVisible:true,
     headerShown:true,
      headerStatusBarHeight:50,
  
      
      
     
      
     //  header: () => <Header title={'Bottom Demo'} />
    }}>
    <Tab.Screen name="Home" component={Home} options={{
      tabBarIcon: ({ focused }) => (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={image_home} resizeMode="contain" style={[styles.bottomTabIcon, { tintColor: focused ? white : black }]} />
        <Text style={[styles.appTextBold14, { fontFamily: focused ? 'Raleway-Black' : 'Raleway-Regular', color: focused ? white : black }]}>Home</Text>
      </View>)
    }} />
    <Tab.Screen name="Search" component={Search} options={{
      tabBarIcon: ({ focused }) => (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={IMAGES.image_search} resizeMode="contain" style={[styles.bottomTabIcon, { tintColor: focused ? white : black }]} />
        <Text style={[styles.appTextBold14, { fontFamily: focused ? 'Raleway-Black' : 'Raleway-Regular', color: focused ? white : black }]}>Serach</Text>
      </View>)
    }} />

    <Tab.Screen name="AddProducts" component={AddProducts} options={{
      tabBarIcon:
        ({ focused }) => (
          <View style={{
            width: 60, height: 60, borderRadius: 60 / 2,
            backgroundColor: 'orange', bottom: 40, justifyContent: 'center', alignItems: 'center'
          }}>
            <Image source={image_add} resizeMode="contain"
              style={[styles.bottomTabIcon, { tintColor: focused ? white : black }]} />
          </View>


        )


    }} />


    <Tab.Screen name="WishList" component={WishList} options={{
      tabBarIcon: ({ focused }) => (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={image_wishlist} resizeMode="contain" style={[styles.bottomTabIcon, { tintColor: focused ? white : black }]} />
        <Text style={[styles.appTextBold14, { fontFamily: focused ? 'Raleway-Black' : 'Raleway-Regular', color: focused ? white : black }]}>WishList</Text>
      </View>)
    }} />
    <Tab.Screen name="Settings" component={Settings} options={{
      tabBarIcon: ({ focused }) => (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={image_city} resizeMode="contain" style={[styles.bottomTabIcon, { tintColor: focused ? white : black }]} />
        <Text style={[styles.appTextBold14, { fontFamily: focused ? 'Raleway-Black' : 'Raleway-Regular', color: focused ? white : black }]}>Settings</Text>
      </View>)
    }} />

  </Tab.Navigator>

  )

}
export default BottomNavigaiton;
const styles = StyleSheet.create({

  bottomTabIcon: {
    width: 30,
    height: 30,
    tintColor: white

  },
  bottomTabTopIcon: {
   backgroundColor:primaryColor

  },
  appTextBold14: {
    fontSize: 14,
    color: white,
    textShadowRadius: 10,
    borderWidth: 2,
    textShadowOffset: { width: 5, height: 5 },
    borderColor: white


  },
  headerStyle: {
    fontSize: 14,
    color: white,
 fontFamily:'Raleway-Black'
  },
})