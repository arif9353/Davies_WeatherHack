import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, ImageBackground, TouchableOpacity, Text } from 'react-native';
import AQIInfo from '../components/AQIInfo';
import ParamEffects from '../components/ParamEffects';
import LineChart from '../components/LineChart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeatherDetails from '../components/WeatherDetails';
import IP from './IP_Address';

const DetailsPage = ({ navigation }) => {
    const [pollutants, setPollutants] = useState(null);
    const [aqiData, setAqiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aqiVal, setAqiVal] = useState(0);

    const viewMore = async () => {
        try {
            navigation.navigate("Trend");
        } catch (error) {
            console.error("Error navigation>>>", error);
        }
    }
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
            const response = await fetch(`${IP}/future_values`); // Replace with your actual API
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
        <ImageBackground
            source={require("../assets/bg.png")}
            style={styles.backgroundImage}
        >
            <ScrollView style={styles.container}>
                <View style={styles.contentContainer}>
                    {/* AQI Info */}
                    <AQIInfo aqi={aqiVal || 'N/A'} remark="Pollutant Information" location="Navi Mumbai, Sector 19A" />

                    {/* Display pollutants */}
                    <ParamEffects pollutants={pollutants} />

                    {/* Display line chart */}
                    <LineChart aqiData={aqiData} />
                </View>
                <TouchableOpacity onPress={viewMore} style={styles.viewMore}>
                    <Text style={styles.viewTxt}>View more</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 60
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
    backgroundImage: {
        width: '100%',
        height: "100%",
        // height: 400,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    viewMore: {
        marginHorizontal: 20,
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 20
    },
    viewTxt: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "700",
        color: "white"
    }
});

export default DetailsPage;
