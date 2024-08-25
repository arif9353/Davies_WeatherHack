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
          aqi <= 250 ? '#004d00' : // Dark green
          aqi <= 300 ? '#008000' : // Darker green
          aqi <= 370 ? '#ccaa00' : // Dark yellow
          aqi <= 450 ? '#cc5500' : // Dark orange
          aqi <= 500 ? '#b30000' : // Dark red
          '#660000'; // Darker red

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
