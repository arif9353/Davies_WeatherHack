import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WeatherDetails = () => {
    return (
        <View style={styles.weatherDetails}>
            <Text style={styles.temperature}>24°C</Text>
            <View style={styles.weatherInfo}>
                <Text style={styles.infoText}>89%</Text>
                <Text style={styles.infoText}>13km/hr</Text>
                <Text style={styles.infoText}>91%</Text>
            </View>
            <Text style={styles.locationText}>Navi Mumbai, Sector 19A</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    weatherDetails: {
        alignItems: 'center',
        marginTop: 80,
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
    locationText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
});

export default WeatherDetails;
