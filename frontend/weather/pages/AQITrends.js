import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import RNPickerSelect from 'react-native-picker-select';

const AQITrendsPage = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('Nov');

  // Filter data for the selected month
  const filteredData = data.filter(item => item.Date === selectedMonth);

  // Fetch Data
  const fetchTrend = async () => {
    try {
      const response = await fetch('http://192.168.0.148:8000/trend_analysis');
      const json = await response.json();
      if (json.success) {
        console.log("Filtered Data for Chart:", json.message);
        setData(json.message);
      } else {
        console.log("Error in fetch Trend");
      }
    } catch (error) {
      console.error('Error in fetch: ', error);
    }
  };

  useEffect(() => {
    fetchTrend();
  }, []);

  const handleDotPress = (item) => {
    setSelectedData(item);
    setModalVisible(true);
  };

  // Calculate 3-day moving average (for simplicity, using a small window size)
  const calculateMovingAverage = (data) => {
    const movingAvg = [];
    for (let i = 0; i < data.length; i++) {
      const window = data.slice(Math.max(0, i - 2), i + 1); // Last 3 days
      const avg = window.reduce((acc, curr) => acc + curr.AQI, 0) / window.length;
      movingAvg.push(avg);
    }
    return movingAvg;
  };

  // Function to calculate AQI daily rate of change
  const calculateDailyChange = (data) => {
    const changes = [];
    for (let i = 1; i < data.length; i++) {
      const change = ((data[i].AQI - data[i - 1].AQI) / data[i - 1].AQI) * 100;
      changes.push({
        date: data[i]['Date & Time'],
        change: change.toFixed(2), // rounding to 2 decimal places
      });
    }
    return changes;
  };

  const classifyAQI = (aqi) => {
    if (aqi <= 50) return { category: 'Good', description: 'Air quality is satisfactory.' };
    if (aqi <= 100) return { category: 'Moderate', description: 'Air quality is acceptable.' };
    if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', description: 'Members of sensitive groups may experience health effects.' };
    if (aqi <= 200) return { category: 'Unhealthy', description: 'Everyone may begin to experience health effects.' };
    if (aqi <= 300) return { category: 'Very Unhealthy', description: 'Health alert: everyone may experience more serious health effects.' };
    return { category: 'Hazardous', description: 'Health warnings of emergency conditions.' };
  };

  const findBestWorstDays = (data) => {
    const sorted = [...data].sort((a, b) => a.AQI - b.AQI);
    return {
      bestDay: sorted[0], // Day with lowest AQI
      worstDay: sorted[sorted.length - 1], // Day with highest AQI
    };
  };
  
  // Example of displaying best and worst days
  const { bestDay, worstDay } = findBestWorstDays(filteredData);

  const movingAverage = calculateMovingAverage(filteredData);

  // Define label positions every 5 days
  const labels = filteredData.map((item, index) => {
    return index % 5 === 0 ? new Date(item['Date & Time']).getDate().toString() : ''; // Label only every 5 days
  });

  return (
    <ImageBackground 
      source={require("../assets/bg.png")}                
      style={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>AQI Trend Analysis</Text>

        {/* Dropdown for Month Selection */}
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedMonth(value)}
            items={[
              { label: 'November', value: 'Nov' },
              { label: 'December', value: 'Dec' },
              { label: 'January', value: 'Jan' },
              { label: 'February', value: 'Feb' },
              { label: 'March', value: 'Mar' },
            ]}
            value={selectedMonth}
            style={pickerSelectStyles} // Custom styles for the picker
          />
        </View>

        {filteredData.length > 0 ? (
          <LineChart
            data={{
              labels: labels, // Label every 5 days
              datasets: [
                {
                  data: filteredData.map(item => item.AQI),
                  color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Soft green for AQI values
                },
                {
                  data: movingAverage,
                  color: (opacity = 1) => `rgba(200, 255, 230, ${opacity})`, // Soft blue for moving average
                },
              ],
            }}
            width={Dimensions.get('window').width - 40} // Adjusted to perfectly fit within the view
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: 'transparent', // Transparent chart background
              backgroundGradientFrom: 'transparent',
              backgroundGradientTo: 'transparent',
              backgroundGradientFromOpacity: 0.6,
              backgroundGradientToOpacity: 0.4,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White for labels and lines
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White for chart labels
              decimalPlaces: 0,
              propsForBackgroundLines: {
                stroke: 'transparent', // Remove the gray grid lines
              },
            }}
            style={{
              backgroundColor: 'transparent', // Ensure full transparency
              borderRadius: 16,
              marginVertical: 20,
            }}
            onDataPointClick={(dataPoint) => handleDotPress(filteredData[dataPoint.index])}
          />
        ) : (
          <Text style={styles.noDataText}>No data available for the selected month</Text>
        )}

        <View style={styles.bestWorst}>
          <View>
            <Text style={styles.DayText}>Best Day: {new Date(bestDay['Date & Time']).toLocaleString()}</Text>
            <Text style={styles.aqiTxt}>AQI: {bestDay.AQI}</Text>
          </View>
          <View>
            <Text style={styles.DayText}>Worst Day: {new Date(worstDay['Date & Time']).toLocaleString()}</Text>
            <Text style={styles.aqiTxt}>AQI: {worstDay.AQI}</Text>
          </View>
        </View>
        {/* Modal with Blur and Black Mask */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalBackground}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  {selectedData && (
                    <>
                      <Text style={styles.modalText}>Date: {new Date(selectedData['Date & Time']).toLocaleString()}</Text>
                      <Text style={styles.modalText}>AQI: {selectedData.AQI}</Text>
                      <Text style={styles.modalText}>Ratio: {selectedData.Ratio}</Text>
                    </>
                  )}
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalCloseButton}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  backgroundImage: {
    width: '100%',
    height: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black mask with opacity for blur effect
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent modal background
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
  },
  modalText: {
    color: 'black',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalCloseButton: {
    color: 'blue',
    marginTop: 10,
    textAlign: 'center',
  },
  noDataText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  bestWorst: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    gap: 16,
    borderRadius: 20
  },
  DayText: {
    color: "white",
    fontSize: 18
  },
  aqiTxt: {
    fontSize: 24,
    fontWeight: "900",
    color: 'white',
    textAlign: "center",
  }
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is not hidden
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 4,
    color: 'white',
    paddingRight: 30, // to ensure the text is not hidden
  },
};

export default AQITrendsPage;
