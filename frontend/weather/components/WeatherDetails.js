import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import * as Font from "expo-font";

const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
  
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes; // Add leading 0 to minutes if needed
  
    const strTime = `${hours}:${minutes} ${ampm}`;
    return strTime;
};

const WeatherDetails = ({ precipitation, temperature, humidity, wind }) => {

    const now = new Date(); // Get the current time
    const formattedTime = formatTime(now);

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
        <View style={styles.weatherDetails}>
            <View style={styles.topDet}>
                <View>
                    <View style={styles.temp}>
                        <Text style={styles.temperature}>
                            {temperature}
                            <View style={styles.celsiusContainer}>
                                <Text style={styles.celsius}>°C</Text>
                            </View>
                        </Text>
                    </View>
                    <Text style={styles.timeText}>{formattedTime}</Text>
                </View>
                <View style={styles.weatherInfo}>
                    <View style={styles.iconVal}>
                        <View style={styles.label}>
                            <Fontisto name="rain" size={16} color="white" />
                            <Text style={styles.labelTxt}>Rain</Text>
                        </View>
                        <Text style={styles.infoText}>{precipitation}%</Text>
                    </View>
                    <View style={styles.iconVal}>
                        <View style={styles.label}>
                            <Fontisto name="wind" size={16} color="white" />
                            <Text style={styles.labelTxt}>Wind</Text>
                        </View>
                        <Text style={styles.infoText}>{wind}km/hr</Text>
                    </View>
                    <View style={styles.iconVal}>
                        <View style={styles.label}>
                            <Ionicons name="water-outline" size={16} color="white" />
                            <Text style={styles.labelTxt}>Humidity</Text>
                        </View>
                        <Text style={styles.infoText}>{humidity}%</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    weatherDetails: {
        // alignItems: 'center',
        marginBottom: 40,
        marginHorizontal: 20,
        // flexDirection: "row"
    },
    weatherInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: "wrap",
        width: '46%',
        marginTop: 10,
        gap: 12,
        marginHorizontal: 24
    },
    topDet: {
        flexDirection: "row"
    },
    iconVal: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4
    },
    infoText: {
        color: '#fff',
        fontWeight: '300',
        fontSize: 24,
        fontFamily: "Manrope-Regular",
    },
    timeText: {
        fontWeight: 'bold',
        fontSize: 24,
        fontFamily: "JuliusSansOne-Regular",
        color: '#fff',
    },
    thirdText: {
        position: 'relative',
    },
    text: {
        fontFamily: "ManropeBold",
        fontSize: 72,
        color: '#f8d7da', // Light pink color
        // position: 'absolute',
        lineHeight: 74
    },
    textShadow: {
        position: "absolute",
        color: '#8B0000', // Dark red shadow color
        left: 3,
        top: 3,
    },
    temp: {
        flexDirection: "row",
        alignItems: 'flex-start',
        
    },
    temperature: {
        fontSize: 82,
        fontFamily: "ManropeExtraL",
        color: '#ffe4e5',
        alignItems: 'flex-start',
    },
    celsiusContainer: {
        justifyContent: 'flex-start',
        marginTop: 46, // Adjust this value to fine-tune the position of °C
    },
    celsius: {
        fontFamily: "ManropeLight",
        fontSize: 30, // Smaller font size for the °C
        color: '#F5DFDF',
        // lineHeight: 30, // Ensures that the °C symbol is vertically centered within its container
    },
    label: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderRadius: 32,
        backgroundColor: 'rgba(216, 184, 185, 0.31)',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    labelTxt: {
        fontSize: 14,
        fontFamily: "ManropeReg",
        color: '#fff',
    },
});

export default WeatherDetails;
