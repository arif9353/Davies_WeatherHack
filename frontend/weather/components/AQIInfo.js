import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AQIInfo = ({ aqi, remark, location }) => {
    return (
        <View style={styles.aqiContainer}>
            <Text style={styles.aqiText}>AQI</Text>
            <Text style={styles.aqiValue}>{aqi}</Text>
            <Text style={styles.locationText}>{location}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    aqiContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    aqiText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '300',
    },
    aqiValue: {
        fontSize: 80,
        color: '#fff',
        fontWeight: 'bold',
    },
    remarkText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
    },
    locationText: {
        color: '#fff',
        marginTop: 20,
        fontSize: 16,
    },
});

export default AQIInfo;
