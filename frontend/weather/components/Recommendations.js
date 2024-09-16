import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import * as Font from "expo-font";

const Recommendations = ({ recommendations }) => {

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
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Recommendations</Text>
            {recommendations.length > 0 ? (
                recommendations.map((item, index) => (
                    <View key={index} style={styles.recommendationItem}>
                        <Text style={styles.recommendationTitle}>{item.title}</Text>
                        <Text style={styles.recommendationDescription}>{item.description}</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.noDataText}>No recommendations available</Text>
            )}
            <Text style={styles.end}>Reload after some time!</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
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
    recommendationItem: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#fff', // Matching the theme color
        borderRadius: 10,
    },
    recommendationTitle: {
        fontSize: 18,
        color: '#B22D30',
        fontFamily: "ManropeExtraB"
    },
    recommendationDescription: {
        fontSize: 16,
        color: '#B22D30',
        fontFamily: "ManropeLight",
        marginTop: 10
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

export default Recommendations;
