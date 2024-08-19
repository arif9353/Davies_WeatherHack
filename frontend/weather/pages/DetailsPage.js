import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import AQIInfo from '../components/AQIInfo';
import ParamEffects from '../components/ParamEffects';
import LineChart from '../components/LineChart';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsPage = () => {
    const [pollutants, setPollutants] = useState(null);
    const [aqiData, setAqiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aqiVal, setAqiVal] = useState(0);

    // Function to retrieve pollutants from local storage
    const getPollutants = async () => {
        try {
            const storedPollutants = await AsyncStorage.getItem('@pollutants');
            if (storedPollutants) {
                setPollutants(JSON.parse(storedPollutants));
            }
        } catch (error) {
            console.error('Error retrieving pollutants:', error);
        }
    };

    // Fetch AQI data from backend API
    const fetchAqiData = async () => {
        try {
            const response = await fetch('http://192.168.10.8:8000/future_values'); // Replace with your actual API
            const json = await response.json();
            if (json.success) {
                setAqiData(json.message);
            } else {
                console.error('Failed to fetch AQI data');
            }
        } catch (error) {
            console.error('Error fetching AQI data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAQIval = async () => {
        try {
            const aqilocalstorage = await AsyncStorage.getItem('AQI');
            if (aqilocalstorage) {
                setAqiVal(aqilocalstorage);
            }
        } catch (error) {
            console.error('Error retrieving AQIVALUE FROM ASYNC:', error);
        }
    }

    // Fetch pollutants from local storage and AQI data on component mount
    useEffect(() => {
        getPollutants();
        fetchAqiData();
        getAQIval();
    }, []);

    // Show loading spinner if data is still being fetched
    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.contentContainer}>
                {/* AQI Info */}
                <AQIInfo aqi={aqiVal || 'N/A'} remark="Pollutant Information" location="Navi Mumbai, Sector 19A" />

                {/* Display pollutants */}
                <ParamEffects pollutants={pollutants} />

                {/* Display line chart */}
                <LineChart aqiData={aqiData} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    contentContainer: {
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        margin: 20,
        borderRadius: 20,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});

export default DetailsPage;
