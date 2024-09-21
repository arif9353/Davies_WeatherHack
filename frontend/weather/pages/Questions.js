import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const UserTypePage = () => {
    const navigation = useNavigation();

    // State for user type and related form fields
    const [userType, setUserType] = useState(null);
    const [ageGroup, setAgeGroup] = useState(null);
    const [disorder, setDisorder] = useState('');
    const [jobType, setJobType] = useState('');
    const [organizationType, setOrganizationType] = useState(null);

    // Handle form submission and save selected data
    const handleNext = async () => {
        let selectedValues = [];

        if (userType === 'individual') {
            selectedValues.push(userType, ageGroup, disorder, jobType);
        } else if (userType === 'organization') {
            selectedValues.push(userType, organizationType);
        } else {
            selectedValues.push(userType);
        }
        console.log(selectedValues);
        // Store values in AsyncStorage (local storage)
        try {
            let storedData = await AsyncStorage.getItem('userSelections');
            storedData = storedData ? JSON.parse(storedData) : [];

            // Append new selections to the list
            storedData.push(selectedValues);

            // Save back to AsyncStorage
            await AsyncStorage.setItem('userSelections', JSON.stringify(storedData));
            console.log(storedData);
            // Navigate to the next page (LandingPage)
            navigation.navigate('LandingPage');
        } catch (error) {
            console.error('Error saving data to AsyncStorage:', error);
        }
    };

    return (
        <ImageBackground 
            source={{ uri: 'https://your-image-url-here.com' }}  // Use a soft, blurry background image
            style={styles.background}
        >
            <Animatable.View animation="fadeInUp" duration={1000} style={styles.container}>
                <View style={styles.glassCard}>
                    <Text style={styles.question}>What describes you best?</Text>

                    {/* Picker for Person/Organization/Govt */}
                    <RNPickerSelect
                        onValueChange={(value) => setUserType(value)}
                        items={[
                            { label: 'Individual', value: 'individual' },
                            { label: 'Organization', value: 'organization' },
                            { label: 'Government Official', value: 'government' },
                        ]}
                        placeholder={{ label: 'Select Type', value: null }}
                        style={pickerSelectStyles}
                    />
                    {userType === 'individual' && (
                        <View>
                            <Text style={styles.question}>What age group do you lie in?</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setAgeGroup(value)}
                                items={[
                                    { label: '0-15', value: '0-15' },
                                    { label: '16-27', value: '16-27' },
                                    { label: '28-45', value: '28-45' },
                                    { label: '45 and above', value: '45+' },
                                ]}
                                placeholder={{ label: 'Select Age Group', value: null }}
                                style={pickerSelectStyles}
                            />

                            <Text style={styles.question}>Any disorder you are facing?</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter disorder"
                                placeholderTextColor="#AAAAAA"
                                value={disorder}
                                onChangeText={(text) => setDisorder(text)}
                            />

                            <Text style={styles.question}>Job type?</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter job type"
                                placeholderTextColor="#AAAAAA"
                                value={jobType}
                                onChangeText={(text) => setJobType(text)}
                            />
                        </View>
                    )}

                    {userType === 'organization' && (
                        <View>
                            <Text style={styles.question}>What type of organization are you?</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setOrganizationType(value)}
                                items={[
                                    { label: 'Large-scale Industry', value: 'large_scale' },
                                    { label: 'Small-Scale Industry', value: 'small_scale' },
                                    { label: 'Educational Institutions', value: 'educational' },
                                    { label: 'Hospitals', value: 'hospital' },
                                    { label: 'Sports Complex', value: 'sports_complex' },
                                    { label: 'Restaurants', value: 'restaurant' },
                                    { label: 'Residential Complex', value: 'residential_complex' },
                                ]}
                                placeholder={{ label: 'Select Organization Type', value: null }}
                                style={pickerSelectStyles}
                            />
                        </View>
                    )}

                    {/* Next Button */}
                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    glassCard: {
        width: '100%',
        padding: 20,
        borderRadius: 15,
        // backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent white for glassmorphism
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 5 },
        // shadowOpacity: 0.1,
        // shadowRadius: 10,
        // backdropFilter: 'blur(10px)', // Only for web, ignored in mobile but simulates glass
    },
    question: {
        fontSize: 18,
        color: '#333', // Darker text to ensure readability
        fontFamily: 'ManropeBold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly opaque for input fields
        color: '#333', // Darker text
        borderRadius: 8,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#b22d30',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'ManropeBold',
    },
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        color: '#333',
        paddingRight: 30,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Lighter background for glass effect
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        color: '#333',
        paddingRight: 30,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Consistent for Android
    },
};

export default UserTypePage;
