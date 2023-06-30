import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';

const SignUpScreen = () => {
    return (<View style={styles.sectionContainer}>
        <Text style={styles.text}>SignUp Screen </Text>
    </View>)


}


const styles = StyleSheet.create({
    sectionContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center'
    },
    text: {
        fontSize: 20,
        fontFamily: 'Raleway-Black'
    }
});

export default SignUpScreen