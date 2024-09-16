import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Component to display future AQI values with dynamically generated time
const FutureVal = ({ future }) => {
  // Get the current hour
  const currentHour = new Date().getHours();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
      {future.map((item, index) => (
        <View style={styles.forecastBox} key={index}>
          {/* Generate the time dynamically, starting with the current hour and incrementing it */}
          <Text style={styles.timeText}>{`${((currentHour + index) % 24).toString().padStart(2, '0')}:00`}</Text>
          {/* Display the rounded AQI value */}
          <Text style={styles.aqiValue}>{Math.round(item.aqi)}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  scrollContainer: {
    marginVertical: 10,
    paddingLeft: 20,
    marginBottom: 80,
  },
  forecastBox: {
    alignItems: 'center',
    marginRight: 20,
  },
  timeText: {
    color: '#8B0000',
    fontSize: 12,
    marginBottom: 5,
  },
  aqiValue: {
    color: '#8B0000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default FutureVal;
