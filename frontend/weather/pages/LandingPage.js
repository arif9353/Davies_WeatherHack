import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, ImageBackground, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import WeatherDetails from '../components/WeatherDetails';
import AQIInfo from '../components/AQIInfo';
import Recommendations from '../components/Recommendations';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LandingPage = ({ navigation }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch data from backend
    const fetchData = async () => {
        try {
            const response = await fetch('http://192.168.10.8:8000/weather_and_aqi');
            const json = await response.json();
            if (json.success) {
                setData(json.message);
                storePollutants(json.message.pollutants);
                storeAQI(json.message.aqi) // Store pollutants in local storage
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to store pollutants in local storage
    const storePollutants = async (pollutants) => {
        try {
            await AsyncStorage.setItem('@pollutants', JSON.stringify(pollutants));
            console.log('Pollutants stored successfully');
        } catch (error) {
            console.error('Error storing pollutants:', error);
        }
    };
    const storeAQI = async (aqi) => {
        try {
            await AsyncStorage.setItem('AQI', JSON.stringify(aqi));
            console.log('Pollutants stored successfully');
        } catch (error) {
            console.error('Error storing pollutants:', error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
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
            <ImageBackground
                source={{ uri: 'https://example.com/your-background-image.jpg' }} // Replace with your actual image link
                style={styles.backgroundImage}
            >
                <Header />
                {data && (
                    <>
                        {/* Weather Details */}
                        <WeatherDetails
                            temperature={data.temp}
                            humidity={data.humidity}
                            wind={data.wind}
                        />

                        {/* AQI Info */}
                        <TouchableOpacity onPress={() => navigation.navigate('DetailsPage')}>
                            <AQIInfo aqi={data.aqi} remark={data.remark} location="Navi Mumbai, Sector 19A" />
                        </TouchableOpacity>
                    </>
                )}
            </ImageBackground>

            {/* Recommendations */}
            {data && <Recommendations recommendations={data.recommendation} />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundImage: {
        width: '100%',
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});

export default LandingPage;
