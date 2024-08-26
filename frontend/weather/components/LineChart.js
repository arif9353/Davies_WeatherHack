import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Modal, Text, TouchableOpacity } from 'react-native';
import { LineChart as Chart } from 'react-native-chart-kit';

const LineChart = ({ aqiData }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    // Prepare AQI data and labels for the chart
    const aqiValues = aqiData.map((entry) => entry.aqi);
    const labels = aqiData.map((entry) => entry.time); // Using "time" as the labels for the x-axis

    // Handle dot click to show modal with AQI details
    const handleDataPointClick = (data) => {
        setSelectedData(aqiData[data.index]); // Set the selected AQI data for the modal
        setModalVisible(true); // Open the modal
    };

    return (
        <View style={styles.chartContainer}>
            {/* Line Chart */}
            <Chart
                data={{
                    labels: labels, // Time labels
                    datasets: [
                        {
                            data: aqiValues, // AQI values
                        },
                    ],
                }}
                width={Dimensions.get('window').width - 40} // Chart width
                height={220} // Chart height
                chartConfig={{
                    backgroundColor: 'transparent', // Transparent chart background
                    backgroundGradientFrom: 'transparent',
                    backgroundGradientTo: 'transparent',
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientToOpacity: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    strokeWidth: 0, // Line thickness
                    propsForDots: {
                        r: '6', // Radius of the dots
                        strokeWidth: '0',
                        stroke: '#ffa726', // Color of dots
                    },
                    propsForBackgroundLines: {
                        stroke: 'transparent', // Remove the gray grid lines
                    },
                }}
                bezier
                onDataPointClick={handleDataPointClick} // Handle dot click
            />

            {/* Modal to display AQI details */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedData && (
                            <>
                                <Text style={styles.modalTitle}>AQI Details</Text>
                                <Text style={styles.modalText}>AQI: {selectedData.aqi}</Text>
                                <Text style={styles.modalText}>Remark: {selectedData.remark}</Text>
                                <Text style={styles.modalText}>Impact: {selectedData.impact}</Text>
                                <Text style={styles.modalText}>Pollutant: {selectedData.pollutant_res}</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#ffa726',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default LineChart;
