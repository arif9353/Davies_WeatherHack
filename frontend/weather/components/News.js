import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ImageBackground } from 'react-native';
import * as Font from "expo-font";

const News = ({ news }) => {

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
        // <ImageBackground source={require("../assets/bg.png")} style={styles.backgroundImage}>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>AQI-Related News</Text>
                {news.length > 0 ? (
                    news.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.newsItem}
                            onPress={() => Linking.openURL(item.url)}
                        >
                            <Text style={styles.newsTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noDataText}>No news available</Text>
                )}
                <Text style={styles.end}>Reload after some time!</Text>
            </ScrollView>
        // </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: "100%",
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        fontFamily: "ManropeBold"
    },
    newsItem: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#B22D30', // Matching the theme color
        borderRadius: 10,
    },
    newsTitle: {
        fontSize: 18,
        color: '#fff',
        fontFamily: "ManropeReg"
    },
    noDataText: {
        color: '#B22D30',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    end: {
        marginBottom: 100,
        fontFamily: "Julius",
        color: "white",
        textAlign: "center"
    }
});

export default News;
