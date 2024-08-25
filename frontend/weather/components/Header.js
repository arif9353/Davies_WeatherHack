import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
    return (
        <View style={styles.header}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.activeButton]}>
                    <Text style={[styles.buttonText, styles.activeButtonText]}>OUT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>IN</Text>
                </TouchableOpacity>
            </View>
            <Ionicons name="person-circle-outline" size={28} color="white" />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 25,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    buttonText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: 'bold',
    },
    activeButton: {
        backgroundColor: '#fff',
    },
    activeButtonText: {
        color: '#000',
    },
});

export default Header;
