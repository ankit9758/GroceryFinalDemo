import React, { useState, useRef, useEffect } from "react";
import {
    TouchableOpacity, Text, View,
    ScrollView, SafeAreaView, StatusBar, Image, StyleSheet, Keyboard
} from "react-native"

import { useNavigation, useRoute } from '@react-navigation/native'
import OverlayActivityIndicator from "../../common/Loader";

import Header from '../../common/Header';
import { black, white, primaryColor, transparent, darkRed } from "../../utils/Colors";

import AppTextInput from "../../common/AppTextInput";
import AppButton from "../../common/AppButton";
import { image_city, image_radio_selected, image_radio_unselected,
   image_pincode, image_state, image_back } from "../../utils/Images";
import { validateEmpty, validateNumber, validateName ,validateAddress} from '../../common/Validaton'
import { useDispatch } from "react-redux";
import { addAddress, updateAddress } from "../../redux/AddressSlice";
import uuid from 'react-native-uuid';


export default function AddAddress() {
  const navigation = useNavigation()
    const [stateError, setStateError] = useState('')
    const [pincodeError, setPincodeError] = useState('')
    const [cityError, setCityError] = useState('')

    const stateRef = React.useRef()
    const cityRef = React.useRef()
    const pincodeRef = React.useRef()
    const route = useRoute()
    const [state, setState] = useState(route.params.types === 'edit' ? route.params.data.state : '')
    const [city, setCity] = useState(route.params.types === 'edit' ? route.params.data.city : '')
    const [pincode, setPincode] = useState(route.params.types === 'edit' ? route.params.data.pincode : '')
    const [type, setType] = useState(route.params.types === 'edit' ? route.params.data.type == 'Home' ? 1 : 2 : 1)
    const disptach = useDispatch();

 return (<SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={primaryColor} />
        <Header
            leftIcon={image_back}
            title={route.params.types === 'edit' ? 'Edit Address' : 'Add New Adresses'}
            onClickLeftIcon={
                () => navigation.goBack()
            }  isCartScreen={false} />
        <View style={{ flex: 1, padding: 20, backgroundColor: white }}>
            <AppTextInput placeholder={'Enter state'} type={'default'}
                icon={image_state} isLast={false} value={state}
                onChangeText={(text) => { setState(text) }}
                reference={stateRef}
                onSubmit={() => cityRef.current.focus()} />
            {<Text style={[styles.errorText12]}>{stateError}</Text>}

            <AppTextInput placeholder={'Enter city'} type={'default'}
                icon={image_city} isLast={false} value={city}
                onChangeText={(text) => { setCity(text) }}
                reference={cityRef}
                onSubmit={() => pincodeRef.current.focus()} />
            {<Text style={[styles.errorText12]}>{cityError}</Text>}




            <AppTextInput placeholder={'Enter pincode'} type={'numeric'}
                icon={image_pincode} isLast={true} value={pincode}
                onChangeText={(text) => { setPincode(text.replace(/[^0-9]/g, '')) }}
                reference={pincodeRef}
                maxLength={6}

                onSubmit={() => Keyboard.dismiss()} />
            {<Text style={[styles.errorText12]}>{pincodeError}</Text>}

            <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 30 }}>
                <TouchableOpacity style={[styles.btnRadio, { backgroundColor: type == 1 ? primaryColor : transparent }]} onPress={() => {
                    setType(1)
                }}>
                    <Image style={[styles.imgRadio, 
                       { tintColor: type == 1 ? white : black }]} source={type == 1 ? image_radio_selected : image_radio_unselected} />
                    <Text style={{
                        fontSize: 13,
                        color: type == 1 ? white : black,
                        paddingStart: 10,
                        fontFamily: type == 1 ? 'Raleway-Black' : 'Raleway-Regular',
                    }}> Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btnRadio, { backgroundColor: type == 2 ? primaryColor : transparent }]} onPress={() => {
                    setType(2)
                }}>
                    <Image style={[styles.imgRadio, { tintColor: type == 2 ? white : black }]} source={type == 2 ? image_radio_selected : image_radio_unselected} />
                    <Text style={{
                        paddingStart: 10,
                        fontSize: 13,
                        color: type == 2 ? white : black,
                        fontFamily: type == 2 ? 'Raleway-Black' : 'Raleway-Regular',
                    }}>Office</Text>
                </TouchableOpacity>
            </View>

            <AppButton title={route.params.types === 'edit' ? 'Update Address' : 'Save Address'} onPress={() => {
                if (validateEmpty(state)) {
                    setStateError('Please enter state name.')
                } else if (!validateAddress(state)) {
                    setStateError('Please enter valid state name')
                } else if (validateEmpty(city)) {
                    setStateError('')
                    setCityError('Please enter city name')
                } else if (!validateName(city)) {
                    setStateError('')
                    setCityError('Please enter valid city name')
                }
                else if (validateEmpty(pincode)) {
                    setStateError('')
                    setCityError('')

                    setPincodeError('Please enter pincode')
                } else if (!validateNumber(pincode) || pincode.length < 6) {
                    setStateError('')
                    setCityError('')
                    setPincodeError('Please enter valid pincode')
                }
                else {
                    setStateError('')
                    setCityError('')
                    setPincodeError('')
                    if (route.params.types === 'edit') {
                        disptach(updateAddress({ state: state, city: city, pincode: pincode, type: type == 1 ? 'Home' : 'Office', id: route.params.data.id }))
                    } else {
                        disptach(addAddress({ state: state, city: city, pincode: pincode, type: type == 1 ? 'Home' : 'Office', id: uuid.v4() }))
                    }
                    navigation.goBack()


                }

            }} />
        </View>
    </SafeAreaView>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: black
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
btnText: {
    flex: 1,
    fontSize: 13,
    color: primaryColor,
    fontFamily: 'Raleway-Regular',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: 5,
    marginStart: 5
},

btnRadio: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    marginHorizontal: 10,
    borderWidth: 0.3,
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center'
},
imgRadio: {
    width: 24,
    height: 24,

}
})