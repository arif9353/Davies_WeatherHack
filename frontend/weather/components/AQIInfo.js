import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Font from "expo-font";
import * as Progress from 'react-native-progress';

const AQIInfo = ({ aqi, remark, location, res, navigation }) => {

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

    const toDetails = async() => {
        try{
            console.log("Function to navigate");
            navigation.navigate("DetailsPage");
        } catch (error) {
            console.error('Error in to Details: ', error);
        }
    }

    return (
        <View style={styles.aqiContainer}>
            <View style={styles.dets}>
                <Text style={styles.pmText}>AQI value</Text>
            </View>
            <View style={styles.rowMain}>
                <View style={styles.colProgress}>
                    <View style={styles.thirdText}>
                        {/* <Text style={styles.aqiValue}>{aqi}</Text> */}
                        <Text style={[styles.text, styles.textShadow]}>{aqi}</Text>
                        <Text style={styles.text}>{aqi}</Text>
                    </View>
                    <Progress.Bar 
                        progress={aqi/600} 
                        width={160} 
                        height={6}
                        color="#B22D30" 
                        unfilledColor="#D8B8B9" 
                        borderRadius={20} 
                        borderWidth={0} 
                        style={styles.progressBar} 
                    />
                </View>
                <View style={styles.col}>
                    <View style={styles.rowInfo}>
                        <Text style={styles.resText}>{res}</Text>
                        <Text style={styles.info}>info</Text>
                    </View>
                    <View style={styles.descInfo}>
                        <Text style={styles.desc}>
                        A higher AQI means unhealthy air, while a lower AQI means the air is cleaner.
                        </Text>
                        <TouchableOpacity onPress={toDetails}>
                            <Text style={styles.moreInfo}>more info</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    aqiContainer: {
        // alignItems: 'center',
        marginTop: 20,
        width: "90%",
        marginHorizontal: "auto"
    },
    aqiText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '300',
    },
    resText: {
        fontFamily: "ManropeLight",
        color: '#fff',
        fontSize: 24,
        fontWeight: '300',
    },
    aqiValue: {
        fontFamily: "ManropeBold",
        fontSize: 80,
        color: '#fff',
        lineHeight: 88
    },
    thirdText: {
        position: 'relative',
    },
    text: {
        fontFamily: "ManropeBold",
        fontSize: 126,
        color: '#f8d7da', // Light pink color
        // position: 'absolute',
        lineHeight: 130
    },
    textShadow: {
        position: "absolute",
        color: '#8B0000', // Dark red shadow color
        left: 4.5,
        top: 4.5,
    },
    row: {
        flexDirection: "row",
        gap: 20
    },
    rowMain: {
        flexDirection: "row",
        gap: 20,
        marginTop: "4%",
        marginBottom: "10%"
    },
    col: {
        flexDirection: "column",
    },
    colProgress: {
        flexDirection: "column",
        alignItems: "center"
    },
    rowInfo: {
        flexDirection: "row",
        gap: 4
    },
    info: {
        color: "white",
        fontFamily: "ManroperExtraL",
        fontSize: 10
    },
    dets: {
        borderRadius: 32,
        backgroundColor: 'rgba(102, 10, 12, 0.49)',
        alignSelf: 'flex-start'
    },
    pmText: {
        fontFamily: "ManropeExtraB",
        color: '#F5DFDF',
        fontSize: 14,
        fontWeight: '300',
        paddingHorizontal: 12,
        paddingVertical: 10,
        textAlign: "left"
    },
    desc: {
        fontSize: 14,
        fontFamily: "ManropeReg",
        color: '#edd5d5',
        textAlign: "left",
        flexWrap: "wrap",
        width: "38%"
    },
    descInfo: {
        flexDirection: "column",
        gap: 6
    },
    moreInfo: {
        fontSize: 14,
        fontFamily: "ManropeSemiB",
        color: '#fff',
        textDecorationLine: "underline"
    },
    timeText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default AQIInfo;
