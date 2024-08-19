import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Recommendations = ({ recommendations }) => {
    return (
        <View style={styles.recommendationContainer}>
            {recommendations.map((item, index) => (
                <View style={styles.recommendation} key={index}>
                    <Text style={styles.recommendationTitle}>{item.title}</Text>
                    <Text style={styles.recommendationText}>
                        {item.recommendation}
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
