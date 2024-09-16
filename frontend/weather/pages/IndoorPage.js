import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, ImageBackground, View, ActivityIndicator, Text } from 'react-native';
import Header from '../components/Header';
import WeatherDetails from '../components/WeatherDetails';
import AQIInfo from '../components/AQIInfo';
import Recommendations from '../components/Recommendations';
import BottomNavBar from '../components/BottomNav';
import IP from './IP_Address';

const Indoor = ({ navigation }) => {
    const [data, setData] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch data from the backend
    const fetchData = async () => {
        try {
            // Fetch the weather and AQI data
            const response = await fetch(`${IP}/indoor`);
            const json = await response.json();
            if (json.success) {
                setData(json.message); // Set weather and AQI data
                setRecommendations(json.future.recommendations); // Set recommendations from the future key
                console.log("Weather and AQI Data:", json.message);
            } else {
                console.error('Failed to fetch weather and AQI data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Set loading to false after all fetch calls
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
        <ImageBackground source={require("../assets/bg.png")} style={styles.backgroundImage}>
            <Header location="Indoor" navigation={navigation} style={styles.header} />
            {data && (
                <View style={styles.main}>
                    {/* AQI Info */}
                    <AQIInfo aqi={data.aqi} remark={data.remark} location="Navi Mumbai, Sector 19A" res={data.pollutant_res} navigation={navigation} />
                    {/* Weather Details */}
                    <WeatherDetails
                        precipitation={data.precipitation}
                        temperature={data.temp}
                        humidity={data.humidity}
                        wind={data.wind}
                    />
                </View>
            )}

            {/* Scrollable Recommendations Section */}
            <ScrollView style={styles.container}>
                <Text style={styles.titleBar}>Recommendations</Text>
                {recommendations.length > 0 ? (
                    recommendations.map((item, index) => (
                        <View key={index} style={styles.recommendationBox}>
                            <Text style={styles.recommendationTitle}>{item.title}</Text>
                            <Text style={styles.recommendationDescription}>{item.description}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>No recommendations available</Text>
                )}
            </ScrollView>

            {/* Load the BottomNavBar component */}
            <BottomNavBar navigation={navigation} />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 20,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    main: {
        marginTop: 40
    },
    backgroundImage: {
        width: '100%',
        height: "100%",
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    titleBar: {
        fontSize: 20,
        fontFamily: "ManropeBold",
        color: '#b22d30',
        marginBottom: 20,
    },
    recommendationBox: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    recommendationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 5,
    },
    recommendationDescription: {
        fontSize: 16,
        color: '#666',
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#b22d30',
        marginTop: 20,
    },
});

export default Indoor;
