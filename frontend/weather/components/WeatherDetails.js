import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WeatherDetails = ({ temperature, humidity, wind }) => {
    return (
        <View style={styles.weatherDetails}>
            <Text style={styles.temperature}>{temperature}°C</Text>
            <View style={styles.weatherInfo}>
                <Text style={styles.infoText}>{humidity}%</Text>
                <Text style={styles.infoText}>{wind}km/hr</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    weatherDetails: {
        alignItems: 'center',
        marginTop: 100,
    },
    temperature: {
        fontSize: 48,
        color: '#fff',
        fontWeight: '300',
    },
    weatherInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginTop: 10,
    },
    infoText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '300',
    },
});

export default WeatherDetails;
