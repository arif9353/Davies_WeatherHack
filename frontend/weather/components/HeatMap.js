import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const AQIHeatmap = ({ filteredData, handleDotPress }) => {
  const screenWidth = Dimensions.get('window').width; // Get screen width
  const width = screenWidth / 7 - 21; // Calculate box size to fit 7 days per row
  const height = width - 16;
  return (
    <View style={styles.gridContainer}>
      {filteredData.map((item, index) => {
        const aqi = item.AQI;
        const backgroundColor =
          aqi <= 50  ? '#00b050' : // Green (Good)
          aqi <= 100 ? '#92d050' : // Light Green (Satisfactory)
          aqi <= 200 ? '#ffff00' : // Yellow (Moderate)
          aqi <= 300 ? '#ff9900' : // Orange (Poor)
          aqi <= 400 ? '#ff0000' : // Red (Very Poor)
          aqi <= 500 ? '#990000' : // Dark Red (Severe)
          '#660000';               // Extremely high (beyond AQI range)

        return (
          <TouchableOpacity
            key={index}
            style={[styles.gridItem, { backgroundColor, width: width, height: height }]}
            onPress={() => handleDotPress(item)}
          >
            <Text style={styles.gridItemText}>{new Date(item['Date & Time']).getDate()}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow items to wrap to the next row
    // justifyContent: 'space-between',
    marginVertical: "auto",
    paddingHorizontal: 5,
    gap: 6
  },
  gridItem: {
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  gridItemText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AQIHeatmap;
