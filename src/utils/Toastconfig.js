import Toast from 'react-native-toast-message';
import {  darkRed,  white } from './Colors';
import { Image, Text, View } from 'react-native'
import { image_error, image_sucess } from '../utils/Images';



export const toastConfig = {
  sucess: ({ props }) => (
    <View style={{
      paddingVertical: 15,

      borderRadius: 20,
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      paddingHorizontal: 50,
      backgroundColor: 'green',
      alignSelf: 'center'
    }}>
      <Image style={{ tintColor: white, height: 24, width: 24 }} source={image_sucess} />
      <Text style={{ marginStart: 15,marginTop:2, color: white, fontFamily: 'Raleway-Regular' }} >{props.message}</Text>
    </View>
  ),

  error: ({ props }) => (
    <View style={{
      paddingVertical: 15,
      borderRadius: 20,
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      paddingHorizontal: 50,
      backgroundColor: darkRed,
      alignSelf: 'center'
    }}>
      <Image style={{ tintColor: white, height: 24, width: 24 }} source={image_error} />
      <Text style={{ marginStart: 15,marginTop:2, color: white, fontFamily: 'Raleway-Regular' }} >{props.message}</Text>
    </View>
  )
};

/*
  2. Pass the config as prop to the Toast component instance
*/

const showCustomToast = (type, message) => {
  Toast.show({
    position: 'bottom',
    props: { message: message },
    autoHide: true,
    visibilityTime: 2000,
    type: type,
  })
}

export default showCustomToast;