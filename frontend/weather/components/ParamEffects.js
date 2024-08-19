import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ParamEffects = ({ pollutants }) => {
    return (
        <View style={styles.paramContainer}>
            {pollutants && Object.entries(pollutants).map(([key, value], index) => (
                <View style={styles.paramRow} key={index}>
                    <Text style={styles.paramText}>{key}</Text>
                    <Text style={styles.effectText}>{value}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    paramContainer: {
        marginTop: 20,
    },
    paramRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    paramText: {
        color: '#fff',
        fontSize: 16,
    },
    effectText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ParamEffects;
