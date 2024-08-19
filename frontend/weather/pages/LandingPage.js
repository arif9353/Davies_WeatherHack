import React from 'react';
import { ScrollView, StyleSheet, ImageBackground, View, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import WeatherDetails from '../components/WeatherDetails';
import AQIInfo from '../components/AQIInfo';
import Recommendations from '../components/Recommendations';

const LandingPage = ({ navigation }) => {
    return (
        <ScrollView style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://example.com/your-background-image.jpg' }} // Replace with your actual image link
                style={styles.backgroundImage}
            >
                <Header />
                <WeatherDetails />
                <TouchableOpacity onPress={() => navigation.navigate('DetailsPage')}>
                    <AQIInfo />
                </TouchableOpacity>
            </ImageBackground>
            <Recommendations />
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
});

export default LandingPage;
