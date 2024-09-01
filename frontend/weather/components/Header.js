import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Font from "expo-font";

const Header = ({location, navigation}) => {

    const handleBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          // Handle the situation where there's no screen to go back to
          console.warn("No screen to go back to");
        }
    };

    const [fontsLoaded] = Font.useFonts({
        ManropeReg: require("../assets/fonts/Manrope-Regular.ttf"), 
        ManropeBold: require("../assets/fonts/Manrope-Bold.ttf"), 
        ManropeSemiB: require("../assets/fonts/Manrope-SemiBold.ttf"), 
        ManropeLight: require("../assets/fonts/Manrope-Light.ttf"), 
        ManropeExtraL: require("../assets/fonts/Manrope-ExtraLight.ttf"), 
        ManropeExtraB: require("../assets/fonts/Manrope-ExtraBold.ttf"), 
        ManropeMedium: require("../assets/fonts/Manrope-Medium.ttf"), 
        Julius: require("../assets/fonts/JuliusSansOne-Regular.ttf"), 
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleBackPress}>
                <Image source={require('../assets/logo.png')} style={styles.logo}/>
            </TouchableOpacity>
            <View style={styles.col}>
                <Text style={styles.loc}>location</Text>
                <Text style={styles.locName}>{location}</Text>
            </View>
        </View>
        // <View style={styles.header}>
        //     <View style={styles.buttonContainer}>
        //         <TouchableOpacity style={[styles.button, styles.activeButton]}>
        //             <Text style={[styles.buttonText, styles.activeButtonText]}>OUT</Text>
        //         </TouchableOpacity>
        //         <TouchableOpacity style={styles.button}>
        //             <Text style={styles.buttonText}>IN</Text>
        //         </TouchableOpacity>
        //     </View>
        //     <Ionicons name="person-circle-outline" size={28} color="white" />
        // </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "14%",
        marginHorizontal: "6%"
    },
    loc: {
        color: "white",
        fontFamily: "ManropeReg"
    },
    locName: {
        fontSize: 20,
        color: "#FFE4E5",
        fontFamily: "ManropeBold",
        width: 240,
        textAlign: "right"
    },
    col: {
        flexDirection: "column",
        alignItems: "flex-end"
    },
    logo: {
        width: 80,
        height: 80
    }
    // header: {
    //     position: 'absolute',
    //     top: 40,
    //     left: 20,
    //     right: 20,
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //     marginVertical: 20
    // },
    // buttonContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     backgroundColor: 'rgba(255, 255, 255, 0.1)',
    //     borderRadius: 25,
    // },
    // button: {
    //     paddingHorizontal: 20,
    //     paddingVertical: 8,
    //     borderRadius: 20,
    // },
    // buttonText: {
    //     color: 'rgba(255, 255, 255, 0.5)',
    //     fontWeight: 'bold',
    // },
    // activeButton: {
    //     backgroundColor: '#fff',
    // },
    // activeButtonText: {
    //     color: '#000',
    // },
});

export default Header;
