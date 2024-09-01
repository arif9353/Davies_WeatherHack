import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const FutureVal = ({ future }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
      {future.map((item, index) => (
        <View style={styles.forecastBox} key={index}>
          <Text style={styles.timeText}>{`${item.time.toString().padStart(2, '0')}:00`}</Text>
          <Text style={styles.aqiValue}>{Math.round(item.aqi)}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginVertical: 10,
    paddingLeft: 20,
    marginBottom: 80
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
