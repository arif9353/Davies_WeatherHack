import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import News from '../components/News'; // Adjust the path as needed
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNav'; // Adjust the path as needed
import IP from './IP_Address';

const NewsPage = ({ navigation }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`${IP}/aqi_news`);
                const json = await response.json();
                if (json.success) {
                    setNews(json.message);
                } else {
                    console.error('Failed to fetch news');
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
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
                <News news={news} />
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

export default NewsPage;
