import { View, Text, Appearance } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppNavigator from './src/AppNavigator';
import { Provider } from 'react-redux';
import RNBootSplash from "react-native-bootsplash";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_DATA } from './src/utils/AppConstant';
import { ThemeContext } from './src/utils/ThemeContext';
import { store } from './src/redux/store';


const App = () => {

  const [theme, setTheme] = useState({ mode: 'light' })
  const [isLoginchecked, setIsLoginChecked] = useState(false)
  const [initalRoute, setInitalRoute] = useState('')
  const [userData, setUserData] = useState({})

  useEffect(() => {

    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
  }, [initalRoute]);

  const init = async () => {
    // …do multiple sync or async tasks
    try {
      const jsonData = await AsyncStorage.getItem(USER_DATA);
      if (jsonData !== null) {
        console.log('Retrieved  Nav:', jsonData);
        const data = JSON.parse(jsonData);
        setUserData(data)
        console.log('Retrieved JSON value App Nav:', data);

        setInitalRoute('Main')
        //  setInitalRoute('TabTop')
        setIsLoginChecked(true)
        if (data['email'] !== '') {
          console.log('Retrieved JSON value Nav:', { initalRoute });

        }

        return data;
      } else {
        setInitalRoute('Onboarding')
        console.log('OnB', initalRoute);
        setIsLoginChecked(true)

      }
    } catch (error) {
      setInitalRoute('Onboarding')
      setIsLoginChecked(true)
      console.log('Error retrieving JSON value:', error);

    }
  }
  const updateTheme = (newTheme: any) => {
    let mode;
    const systemColorScheme = Appearance.getColorScheme()
    mode = systemColorScheme === 'dark' ? 'dark' : 'light'
    newTheme = { mode };
    console.log('colorThem==App', systemColorScheme)
    setTheme(newTheme)
  }

  Appearance.addChangeListener(({ colorScheme }) => {
    updateTheme(colorScheme)
  })

  const updateUserData = (user: any) => {
    console.log('colorThem==App', user)
    setUserData(user)
  }

  return (

    initalRoute != '' ? (
      <ThemeContext.Provider value={{ theme, updateTheme, userData }}>
        <Provider store={store}>

          <AppNavigator initalRoute={initalRoute} />

        </Provider>
      </ThemeContext.Provider>
    ) : <View></View>

  )



}
export default App;







// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React from 'react';
// import type { PropsWithChildren } from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({ children, title }: SectionProps): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App(): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     fontFamily:'Raleway-Black'
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     //fontWeight: '400',
//    fontFamily: 'Raleway-Black'
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;





