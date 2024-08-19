import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LineChart as Chart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const LineChart = () => {
    return (
        <View style={styles.chartContainer}>
            <Chart
                data={{
                    labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
                    datasets: [
                        {
                            data: [20, 45, 28, 80, 99, 43, 69, 90],
                        },
                    ],
                }}
                width={Dimensions.get('window').width - 80} // width from screen
                height={120}
                chartConfig={{
                    backgroundColor: '#000',
                    backgroundGradientFrom: '#000',
                    backgroundGradientTo: '#000',
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    strokeWidth: 2,
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
                bezier
            />
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
});

export default LineChart;
