import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Pollutants = ({ pollutants }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
      {Object.keys(pollutants).map((key, index) => (
        <View style={styles.pollutantBox} key={index}>
          <Text style={styles.pollutantTitle}>{key}</Text>
          <Text style={styles.pollutantValue}>{Math.round(pollutants[key])}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginVertical: 10,
    paddingLeft: 20,
  },
  pollutantBox: {
    backgroundColor: 'rgba(102, 10, 12, 0.49)',
    paddingHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 20,
    width: 60,
    height: 70
  },
  pollutantTitle: {
    color: '#fff',
    fontSize: 12,
    // marginBottom: 5,
    textAlign: 'center',
  },
  pollutantValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Pollutants;
