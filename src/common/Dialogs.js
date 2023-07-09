import { View, Text, Image, ScrollView, StyleSheet, Modal, Dimensions, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { black, primaryColor, white } from '../utils/Colors';
import AppButton from './AppButton';
const { height, width } = Dimensions.get('window');
import AppTextInput from './AppTextInput';
import { isValidEmail, validateEmpty } from '../common/Validaton'

export const SimpleModal = ({ title, description, yesText, noText, isShowYes, isShowNo, onYesClick, onNoClick, modelVisible }) => {
    return (
        <Modal visible={modelVisible} transparent animationType={'slide'} >
            <TouchableOpacity onPress={() => { onNoClick() }} >
                <View style={stylesModal.modalView}>
                    <TouchableWithoutFeedback  >
                        <View style={stylesModal.mainView}>
                            <Text style={stylesModal.appTextBold24}>{title}</Text>
                            <Text style={[stylesModal.appTextBold18, { marginTop: 10 }]}>{description}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ width: '50%', marginEnd: 10 }}>
                                    <AppButton title={noText} onPress={() => { onNoClick() }} />
                                </View>
                                <View style={{ width: '50%', marginStart: 10 }}>
                                    <AppButton title={yesText} onPress={() => { onYesClick() }} />
                                </View>

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}




export const ForgotPasswordModal = ({ title, yesText, onNoClick, onYesClick, modelVisible, setEmail, email, emailError, setFogotPasswordEmailError }) => {
    return (
        <Modal visible={modelVisible} transparent animationType={'slide'} >
            <TouchableOpacity onPress={() => { onNoClick() }} >
                <View style={stylesModal.modalView}>
                    <TouchableWithoutFeedback  >
                        <View style={stylesModal.mainView}>

                            <Text style={[stylesModal.appTextBold18, { marginBottom: 10 }]}>{title}</Text>
                            <AppTextInput placeholder={'Enter Email Id'} type={'email-address'}
                                icon={require('../images/mail.png')}
                                isLast={true} value={email}
                                onChangeText={(text) => { setEmail(text) }}
                                onSubmit={() => Keyboard.dismiss()} />
                            {<Text style={[stylesModal.errorText12]}>{emailError}</Text>}
                            <View style={{ marginVertical: 10, width: '90%' }}>
                                <AppButton title={yesText} onPress={() => { 
                                    if(validateEmpty(email)){
                                       setFogotPasswordEmailError('Please Enter Email')
                                    }else if(!isValidEmail(email)){
                                        setFogotPasswordEmailError('Please Enter valid Email')
                                     }
                                    else{
                                        setFogotPasswordEmailError('')
                                        onYesClick(email) 
                                    }
                                    
                                    
                                    }} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableOpacity>
        </Modal>


    );
}


const stylesModal = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    appButtonText: {
        fontSize: 18,
        color: white,
        alignSelf: "center",
        textTransform: "none",
        fontFamily: 'Raleway-ExtraBold'
    },
    appTextBold64: {
        fontSize: 64,
        color: white,
        alignSelf: 'flex-start',
        fontFamily: 'Raleway-Black'

    },
    appButton: {
        padding: 12,
    },
    appTextBold18: {
        fontSize: 18,
        color: black,
        fontFamily: 'Raleway-Regular',
        textAlign:'center'


    },
    errorText12: {
        fontSize: 13,
        color: primaryColor,
        fontFamily: 'Raleway-Regular',
        textAlign:'left',
        alignSelf:'flex-start',
        marginTop:5,
        marginStart:5


    },
    appTextBold24: {
        fontSize: 24,
        color: black,
        fontFamily: 'Raleway-Black'

    },
    appTextBold16: {
        fontSize: 16,
        color: white,
        fontFamily: 'Raleway-SemiBold'

    },
    modalView: {
        backgroundColor: white,
        height: height,
        width: width,
        position: 'absolute',
        top: 0,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'

    },
    mainView: {
        backgroundColor: white,
        paddingBottom: 20,
        width: '90%',
        borderRadius: 10,
        alignContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        paddingHorizontal: 20



    },

})