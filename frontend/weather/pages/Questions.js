import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UserTypePage = () => {
    const navigation = useNavigation(); // Use navigation for redirecting

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
        <View style={styles.container}>


            <Text style={styles.question}>Who are you?</Text>

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
                    <Text style={styles.question}>What age group you lie in?</Text>
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
                        value={disorder}
                        onChangeText={(text) => setDisorder(text)}
                    />

                    <Text style={styles.question}>Job type?</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter job type"
                        value={jobType}
                        onChangeText={(text) => setJobType(text)}
                    />
                </View>
            )}

            {userType === 'organization' && (
                <View>
                    <Text style={styles.question}>What type of organization you are?</Text>
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
            <Button title="Next" onPress={handleNext} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    question: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
    },
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        marginBottom: 20,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        marginBottom: 20,
    },
};

export default UserTypePage;
