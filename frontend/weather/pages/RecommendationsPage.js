import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import Recommendations from '../components/Recommendations'; // Adjust the path as needed
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNav'; // Adjust the path as needed
import IP from './IP_Address';

const RecommendationsPage = ({ navigation }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch(`${IP}/outdoor_recommendations`);
                const json = await response.json();
                if (json.success) {
                    setRecommendations(json.message.recommendations);
                } else {
                    console.error('Failed to fetch recommendations');
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
