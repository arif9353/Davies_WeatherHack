import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AQIInfo from '../components/AQIInfo';
import ParamEffects from '../components/ParamEffects';
import LineChart from '../components/LineChart';

const DetailsPage = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.contentContainer}>
                <AQIInfo />
                <ParamEffects />
                <LineChart />
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
});

export default DetailsPage;
