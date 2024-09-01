import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, ImageBackground, View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import Header from '../components/Header';
import WeatherDetails from '../components/WeatherDetails';
import AQIInfo from '../components/AQIInfo';
import Recommendations from '../components/Recommendations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../components/BottomNav';
import FutureVal from '../components/FutureVal';
import Pollutants from '../components/Pollutants';

const LandingPage = ({ navigation }) => {
    const [data, setData] = useState(null);
    const [future, setFuture] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch data from backend
    const fetchData = async () => {
        try {
            const response = await fetch('http://192.168.0.148:8000/weather_and_aqi');
            const json = await response.json();
            if (json.success) {
                setData(json.message);
                setFuture(json.future);
                console.log("Data>>>>>", data);
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

    const toDetails = async() => {
        try{
            console.log("Function to navigate");
            navigation.navigate("DetailsPage");
        } catch (error) {
            console.error('Error in to Details: ', error);
        }
    }

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
                <Header location="Navi Mumbai, Sector 19A" navigation={navigation} style={styles.header}/>
                {data && (
                    <View style={styles.main}>
                        {/* AQI Info */}
                        <AQIInfo aqi={data.aqi} remark={data.remark} location="Navi Mumbai, Sector 19A" res={data.pollutant_res} navigation={navigation}/>
                        {/* Weather Details */}
                        <WeatherDetails
                            precipitation={data.precipitation}
                            temperature={data.temp}
                            humidity={data.humidity}
                            wind={data.wind}
                        />
                        {/* <Text style={styles.locationText}>{data.location}Navi Mumbai</Text> */}
                    </View>

                )}
                <View style={styles.container}>
                    {/* Recommendations */}
                    <Text style={styles.titleBar}>Pollutants</Text>
                    {data && <Pollutants pollutants={data.pollutants} />}
                    <Text style={styles.titleBar}>Future Forecast</Text>
                    {data && <FutureVal future={future} />}
                    {/* {data && <Recommendations recommendations={data.recommendation} />} */}
                </View>

                {/* Load the BottomNavBar component */}
                <BottomNavBar navigation={navigation} />
            </ImageBackground>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#000',
        // backgroundColor: 'rgba(20, 20, 20, 0.86)',
        backgroundColor: "white",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32, 
        paddingTop: 32
    },
    main: {
        marginTop: 40
    },
    backgroundImage: {
        width: '100%',
        height: "100%",
        // height: 400,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    locationText: {
        color: '#fff',
        marginVertical: 10,
        fontSize: 20,
        fontWeight: "900",
        textAlign: "center"
    },
    metre: {
        marginTop: 20
    },
    titleBar: {
        fontSize: 20,
        fontFamily: "ManropeBold",
        color: '#b22d30',
        marginHorizontal: 20
    }
});

export default LandingPage;
