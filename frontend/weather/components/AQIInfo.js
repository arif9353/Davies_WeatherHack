import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';


const AQIInfo = ({ aqi, remark, location }) => {
    return (
        <View style={styles.aqiContainer}>
        <View style={styles.dets}>
            <Text style={styles.aqiText}>AQI</Text>
            <Text style={styles.pmText}>PM-10</Text>
        </View>
        <View style={styles.wrapper}>
            <AnimatedCircularProgress
                size={220}
                width={12}
                fill={aqi/500 * 100} // Percentage of the speedometer filled
                tintColor="#03E527" // Progress color
                backgroundColor="rgba(0, 0, 0, 0.45)"
                rotation={-90}
                arcSweepAngle={180}
                lineCap="round"
                style={styles.semi}
            >
                {() => (
                <Text style={styles.aqiValue}> {aqi}</Text>
                )}
            </AnimatedCircularProgress>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    aqiContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    aqiText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '300',
    },
    pmText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '300',
    },
    aqiValue: {
        fontSize: 80,
        color: '#fff',
        fontWeight: '500',
        letterSpacing: 7.6,
    },
    dets: {
        flexDirection: "row",
        // justifyContent: "space-between",
        gap: 100,
        marginBottom: 12
    },
    semi: {
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        borderTopRightRadius: 120,
        borderTopLeftRadius: 120,
        padding: 10
    },
    wrapper: {
        height: 160,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: "hidden"
    }
});

export default AQIInfo;
