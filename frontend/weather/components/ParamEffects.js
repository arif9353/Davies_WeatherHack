import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ParamEffects = () => {
    return (
        <View style={styles.paramContainer}>
            {['Param 1', 'Param 2', 'Param 3', 'Param 4', 'Param 5', 'Param 6'].map((param, index) => (
                <View style={styles.paramRow} key={index}>
                    <Text style={styles.paramText}>{param}</Text>
                    <Text style={styles.effectText}>Effect</Text>
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
