import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Component to display future AQI values with dynamically generated time
const FutureVal = ({ future }) => {
  const [storedFuture, setStoredFuture] = useState([]);

  // Function to store future data in AsyncStorage
  const storeFutureData = async (futureData) => {
    try {
      await AsyncStorage.setItem('futureAQI', JSON.stringify(futureData));
    } catch (error) {
      console.error('Error storing data', error);
    }
  };

  // Function to retrieve future data from AsyncStorage
  const getStoredFutureData = async () => {
    try {
      const data = await AsyncStorage.getItem('futureAQI');
      if (data !== null) {
        setStoredFuture(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error retrieving data', error);
    }
  };

  // Store future values when component mounts
  useEffect(() => {
    if (future && future.length > 0) {
      storeFutureData(future);
    }
  }, [future]);

  // Retrieve future values when the component mounts
  useEffect(() => {
    getStoredFutureData();
  }, []);

  // Get the current hour
  const currentHour = new Date().getHours();
  const displayedFuture = storedFuture.length > 0 ? storedFuture : future;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
      {displayedFuture.map((item, index) => (
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
