import { StyleSheet } from "react-native"

export const colors = {
    light: {
        themeColor: '#FFFFFF',
        white: '#000000',
        sky: '#DE5E69',
        gray: 'gray',
        red: '#5E58DA',
    },
    dark: {
        themeColor: '#000000',
        white: '#FFFFFF',
        sky: '#66DA58',
        gray: 'white',
        red: '#088F8F',
    },
    commonWhite: '#ffffff',
    secondary: '#808080',
    commonBlack: '#000000',

}
export const lightthemeStyle = StyleSheet.create({
    card: {
        backgroundColor: colors.light.gray
    }
})
export const darkthemeStyle = StyleSheet.create({
    card: {
        backgroundColor: colors.dark.gray
    }
})
