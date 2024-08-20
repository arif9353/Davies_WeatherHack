import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

const WeatherDetails = ({ temperature, humidity, wind }) => {
    return (
        <View style={styles.weatherDetails}>
            <View style={styles.topDet}>
                <Text style={styles.temperature}>{temperature}°C</Text>
                <View style={styles.weatherInfo}>
                    <View style={styles.iconVal}>
                        <Fontisto name="rain" size={16} color="white" />
                        <Text style={styles.infoText}>89%</Text>
                    </View>
                    <View style={styles.iconVal}>
                        <Fontisto name="wind" size={16} color="white" />
                        <Text style={styles.infoText}>{wind}km/hr</Text>
                    </View>
                    <View style={styles.iconVal}>
                        <Ionicons name="water-outline" size={16} color="white" />
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
        marginTop: 80,
        marginHorizontal: 20,
        // flexDirection: "row"
    },
    temperature: {
        fontSize: 36,
        color: '#fff',
        fontWeight: '100',
    },
    weatherInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        // width: '80%',
        marginTop: 10,
        gap: 24,
        marginHorizontal: 24
    },
    topDet: {
        flexDirection: "row"
    },
    iconVal: {
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: "center"
    },
    infoText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '300',
    },
});

export default WeatherDetails;
