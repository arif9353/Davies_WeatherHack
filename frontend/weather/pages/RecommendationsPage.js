import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import Recommendations from '../components/Recommendations'; // Adjust the path as needed
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNav'; // Adjust the path as needed
import IP from './IP_Address';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecommendationsPage = ({ navigation }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // Fetch values from AsyncStorage
                const futureforecastAQI = await AsyncStorage.getItem('futureAQI');
                const userDetails = await AsyncStorage.getItem('userdetails');

                // Parse the stored values as JSON
                const parsedFutureAQI = JSON.parse(futureforecastAQI);
                const parsedUserDetails = JSON.parse(userDetails);

                // Ensure parsedFutureAQI is an array before mapping
                if (Array.isArray(parsedFutureAQI)) {
                    const aqiValues = parsedFutureAQI.map(entry => entry.aqi);

                    // Create the POST request
                    const response = await fetch(`${IP}/outdoor_recommendations`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            futureforecastAQI: aqiValues,  // Send the parsed future AQI forecast
                            userDetails: parsedUserDetails  // Send the parsed user details
                        }),
                    });

                    const json = await response.json();
                    if (json.success) {
                        setRecommendations(json.message.recommendations);
                    } else {
                        console.error('Failed to fetch recommendations');
                    }
                } else {
                    console.error('Invalid futureforecastAQI format');
                }
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <ImageBackground source={require("../assets/bg.png")} style={styles.backgroundImage}>
            <Header location="Navi Mumbai, Sector 19A" navigation={navigation} />
            <View style={styles.content}>
                <Recommendations recommendations={recommendations} />
            </View>
            <BottomNavBar navigation={navigation} />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: "100%",
    },
    content: {
        flex: 1,
        padding: 12,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});

export default RecommendationsPage;
