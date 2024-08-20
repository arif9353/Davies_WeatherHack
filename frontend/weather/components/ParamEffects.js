import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ParamEffects = ({ pollutants }) => {
    if (!pollutants) return null;

    // Get all the pollutants as an array of entries
    const pollutantEntries = Object.entries(pollutants);

    // Split the array into two halves
    const firstRow = pollutantEntries.slice(0, Math.ceil(pollutantEntries.length / 2));
    const secondRow = pollutantEntries.slice(Math.ceil(pollutantEntries.length / 2));

    return (
        <View style={styles.paramContainer}>
            {/* First Row */}
            <View style={styles.row}>
                {firstRow.map(([key, value], index) => (
                    <View style={styles.paramRow} key={index}>
                        <Text style={styles.paramText}>{key}</Text>
                        <Text style={styles.effectText}>{value}</Text>
                    </View>
                ))}
            </View>

            {/* Second Row */}
            <View style={styles.row}>
                {secondRow.map(([key, value], index) => (
                    <View style={styles.paramRow} key={index}>
                        <Text style={styles.paramText}>{key}</Text>
                        <Text style={styles.effectText}>{value}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    paramContainer: {
        marginTop: 20,
        // Container for rows
    },
    row: {
        flexDirection: "row",
        // justifyContent: "space-between",
        gap: 40,
        // alignItems: "center",
        justifyContent: "center"
    },
    paramRow: {
        flexDirection: 'column',
        marginBottom: 10,
        alignItems: "center"
    },
    paramText: {
        color: '#fff',
        fontSize: 12,
    },
    effectText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: "800"
    },
});

export default ParamEffects;
