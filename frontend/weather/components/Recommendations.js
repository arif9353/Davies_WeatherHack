import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Recommendations = () => {
    return (
        <View style={styles.recommendationContainer}>
            {['A', 'A', 'A'].map((item, index) => (
                <View style={styles.recommendation} key={index}>
                    <Text style={styles.recommendationTitle}>Recommendation {item}</Text>
                    <Text style={styles.recommendationText}>
                        The Air Quality Index (AQI) is a scale that measures the density of pollutants in the air, ranging from 0 to 500. AQI values of 100 or below are generally considered satisfactory.
                    </Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    recommendationContainer: {
        padding: 20,
    },
    recommendation: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
    },
    recommendationTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    recommendationText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default Recommendations;
