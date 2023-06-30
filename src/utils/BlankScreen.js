import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';

const BlankScreen = () => {
    return (<View style={styles.sectionContainer}>
        <Text>Blank Screen </Text>
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

export default BlankScreen