import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AQIInfo = () => {
    return (
        <View style={styles.aqiContainer}>
            <Text style={styles.aqiText}>AQI</Text>
            <Text style={styles.pmText}>PM-10</Text>
            <Text style={styles.aqiValue}>231</Text>
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
    pmText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '300',
    },
    aqiValue: {
        fontSize: 80,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AQIInfo;
