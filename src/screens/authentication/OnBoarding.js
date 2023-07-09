import { View, Text, Dimensions, TouchableOpacity, Animated } from 'react-native';
import React, { useRef, useState } from 'react';
import { black, primaryColor } from '../../utils/Colors';
import stylesApp from '../../utils/styles';
const { height, width } = Dimensions.get('window');

import { useNavigation } from '@react-navigation/native'


const slides = [{
    id: "1",
    title: "First Page ",
    subtitle: "First Page has the value that is one the best thing we have seen in out lifetime you know what i mean ",
    color: '#FF0000'
},
{
    id: "2",
    title: "Second Page ",
    subtitle: "Second Page has the value that is one the best thing we have seen in out lifetime you know what i mean ",
    color: '#00FF00'
},
{
    id: "3",
    title: "Third  Page ",
    subtitle: "Third Page has the value that is one the best thing we have seen in out lifetime you know what i mean ",
    color: '#0000FF'
}];

export default function OnBoardingScreen() {
    const [data, SetData] = useState([1, 1, 1, 1, 1]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const ref = useRef();

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column', backgroundColor: black }}>
            <View
                style={{
                    height: height * 0.8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 25
                }}>
                <Animated.FlatList

                    ref={ref}
                    data={slides}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index}
                    pagingEnabled
                    onScroll={e => {
                        const x = e.nativeEvent.contentOffset.x;
                        setCurrentIndex((x / width).toFixed(0));
                    }}
                    horizontal
                    renderItem={({ item, index }) => {
                        return (
                            <Animated.View
                                key={item.id}
                                style={{
                                    width: width,
                                    height: height,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <TouchableOpacity
                                    disabled={true}
                                    style={{
                                        width: '90%',
                                        height: '90%',
                                        borderRadius: 10,
                                    }}>
                                    <View style={{ flexDirection: 'column', }}>
                                        <View style={{ backgroundColor: item.color, height: '70%', width: '100%' }} />

                                        <Text style={stylesApp.title}>{item.title}</Text>
                                        <Text style={stylesApp.subTitle}>{item.subtitle}</Text>
                                    </View>


                                </TouchableOpacity>
                            </Animated.View>
                        );
                    }}
                />
            </View>
            <Animated.View style={{
                height: height * 0.2,
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
                <View
                    style={{
                        flexDirection: 'row',
                        width: width,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    {slides.map((item, index) => {
                        return (
                            <View
                                style={{
                                    width: currentIndex == index ? 50 : 8,
                                    height: currentIndex == index ? 10 : 8,
                                    borderRadius: currentIndex == index ? 5 : 4,
                                    backgroundColor: currentIndex == index ? primaryColor : 'gray',
                                    marginLeft: 5,
                                }} />
                        );
                    })}
                </View>
                <View style={{ marginTop: 10, flex: 1, justifyContent: 'center',marginHorizontal:20 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => {
                            navigation.reset({
                                key: 'Login',
                                routes: [{ name: 'Login' }]
                            })
                        }}
                            style={[stylesApp.btn
                                , { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'white', marginRight: 5 }]}>
                            <Text style={[stylesApp.appTextBold16, { color: 'white' }]}>SKIP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            if (currentIndex < slides.length - 1) {
                                setCurrentIndex(currentIndex + 1)
                                ref.current.scrollToIndex({ animated: true, index: parseInt(currentIndex) + 1 })
                            } else {
                                navigation.reset({
                                    key: 'Login',
                                    routes: [{ name: 'Login' }]
                                })
                            }
                        }} style={[stylesApp.btn, { marginLeft: 5 }]} >
                            <Text style={stylesApp.appTextBold16}>{currentIndex < slides.length - 1 ? `NEXT` : `SUBMIT`}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Animated.View>

        </View>
    );
}
