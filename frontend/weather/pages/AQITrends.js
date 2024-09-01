import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import RNPickerSelect from 'react-native-picker-select';
import AQIHeatmap from '../components/HeatMap';
import Header from '../components/Header'; // Import the Header component
import BottomNavBar from '../components/BottomNav'; // Import the BottomNavBar component
import * as Font from "expo-font";

const AQITrendsPage = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('Nov');

  const [fontsLoaded] = Font.useFonts({
      ManropeReg: require("../assets/fonts/Manrope-Regular.ttf"), 
      ManropeBold: require("../assets/fonts/Manrope-Bold.ttf"), 
      ManropeSemiB: require("../assets/fonts/Manrope-SemiBold.ttf"), 
      ManropeLight: require("../assets/fonts/Manrope-Light.ttf"), 
      ManropeExtraL: require("../assets/fonts/Manrope-ExtraLight.ttf"), 
      ManropeExtraB: require("../assets/fonts/Manrope-ExtraBold.ttf"), 
      ManropeMedium: require("../assets/fonts/Manrope-Medium.ttf"), 
      Julius: require("../assets/fonts/JuliusSansOne-Regular.ttf"), 
  });

  const fetchTrend = async () => {
    try {
      const response = await fetch('http://192.168.0.148:8000/trend_analysis');
      const json = await response.json();
      if (json.success) {
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
  
  const filteredData = data.filter(item => item.Date === selectedMonth);

  const handleDotPress = (item) => {
    setSelectedData(item);
    setModalVisible(true);
  };

  const findBestWorstDays = (data) => {
    const sorted = [...data].sort((a, b) => a.AQI - b.AQI);
    return {
      bestDay: sorted[0], // Day with lowest AQI
      worstDay: sorted[sorted.length - 1], // Day with highest AQI
    };
  };

  const { bestDay, worstDay } = filteredData.length > 0 ? findBestWorstDays(filteredData) : { bestDay: null, worstDay: null };

  const calculateMovingAverage = (data) => {
    const movingAvg = [];
    for (let i = 0; i < data.length; i++) {
      const window = data.slice(Math.max(0, i - 2), i + 1); // Last 3 days
      const avg = window.reduce((acc, curr) => acc + curr.AQI, 0) / window.length;
      movingAvg.push(avg);
    }
    return movingAvg;
  };

  const movingAverage = calculateMovingAverage(filteredData);

  const labels = filteredData.map((item, index) => {
    return index % 5 === 0 ? new Date(item['Date & Time']).getDate().toString() : ''; // Label only every 5 days
  });

  const openInfoModal = () => {
    setInfoModalVisible(true);
  };
  
  const closeInfoModal = () => {
    setInfoModalVisible(false);
  };
  

  return (
    <ImageBackground 
      source={require("../assets/bg.png")}                
      style={styles.backgroundImage}
    >
      {/* Header Component */}
      <Header location="Navi Mumbai, Sector 19A" navigation={navigation}/>

      {/* Scrollable Content */}
      <ScrollView style={styles.container}>
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
          <Text style={styles.pickerText}>Choose the Month</Text>
        </View>

        {filteredData.length > 0 ? (
          <View style={{ marginVertical: 20 }}>
            {/* Y-Axis Label */}
            <Text style={styles.yAxisLabel}>AQI</Text>
            
            <LineChart
              data={{
                labels: labels, // Labels for the X-axis
                datasets: [
                  {
                    data: filteredData.map(item => item.AQI),
                    color: (opacity = 1) => `rgba(178, 45, 48, ${opacity})`, // Line color matching theme
                  },
                  {
                    data: movingAverage,
                    color: (opacity = 1) => `rgba(255, 200, 200, ${opacity})`, // Moving average line color
                  },
                ],
              }}
              width={Dimensions.get('window').width - 40} // Width of the chart
              height={280} // Height of the chart
              yAxisSuffix="" // Suffix for the Y-axis values
              chartConfig={{
                backgroundColor: 'transparent', 
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Color for labels and lines
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                decimalPlaces: 0,
                propsForBackgroundLines: {
                  stroke: 0, // Light grid lines
                },
                renderDotContent: ({ x, y, index, indexData }) => (
                  <Text
                    key={index}
                    x={x}
                    y={y - 10} // Adjusting position to appear above the dot
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {indexData.toString()} {/* Displaying the AQI value as a label */}
                  </Text>
                ),
              }}
              bezier
              style={{
                backgroundColor: 'transparent', 
                borderRadius: 16,
                marginVertical: 20,
              }}
              onDataPointClick={(dataPoint) => handleDotPress(filteredData[dataPoint.index])}
            />
      
            {/* X-Axis Label */}
            <Text style={styles.xAxisLabel}>Days of Month</Text>
          </View>
        ) : (
          <Text style={styles.noDataText}>No data available for the selected month</Text>
        )}

        {bestDay && worstDay && (
          <View style={styles.bestWorst}>
            <View style={styles.dyVi}>
              <Text style={styles.DayText}>Best Day: <Text style={{fontFamily: "ManropeBold"}}>{new Date(bestDay['Date & Time']).toLocaleString()}</Text></Text>
              <Text style={styles.aqiTxt}>AQI: {bestDay.AQI}</Text>
            </View>
            <View style={styles.dyVi}>
              <Text style={styles.DayText}>Worst Day: <Text style={{fontFamily: "ManropeBold"}}>{new Date(worstDay['Date & Time']).toLocaleString()}</Text></Text>
              <Text style={styles.aqiTxt}>AQI: {worstDay.AQI}</Text>
            </View>
          </View>
        )}
        <View style={styles.htMp}>
          <View style={{flexDirection: "row"}}>
            <Text style={styles.heatTxt}>Heat Map for {selectedMonth}</Text>
            <TouchableOpacity onPress={openInfoModal}>
              <Text style={styles.infoIcon}>info</Text>
            </TouchableOpacity>
          </View>
          {filteredData.length > 0 ? (
            <AQIHeatmap filteredData={filteredData} handleDotPress={handleDotPress} style={styles.heatMap}/>
          ) : (
            <Text style={styles.noDataText}>No data available for the selected month</Text>
          )}
        </View>

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
        <Modal
          visible={infoModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeInfoModal}
        >
          <View style={styles.infoModalBackground}>
            <View style={styles.infoModalContainer}>
              <Text style={styles.infoModalTitle}>Understanding the Heat Map</Text>
              <Text style={styles.infoModalText}>
                The heat map shows the Air Quality Index (AQI) for each day of the month. The colors represent different levels of air quality:
              </Text>
              <Text style={styles.infoModalText}>
                - Dark Green (AQI ≤ 250): Good{"\n"}
                - Darker Green (AQI ≤ 300): Moderate{"\n"}
                - Dark Yellow (AQI ≤ 370): Unhealthy for Sensitive Groups{"\n"}
                - Dark Orange (AQI ≤ 450): Unhealthy{"\n"}
                - Dark Red (AQI ≤ 500): Very Unhealthy{"\n"}
                - Darker Red (AQI &gt; 500): Hazardous
              </Text>
              <TouchableOpacity onPress={closeInfoModal}>
                <Text style={styles.infoModalCloseButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>

      {/* BottomNavBar Component */}
      <BottomNavBar navigation={navigation} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  pickerText: {
    fontFamily: "ManropeReg",
    color: "white",
    marginHorizontal: 10,
    fontSize: 16
  },
  yAxisLabel: {
    position: 'absolute',
    left: -10, // Adjust position to be on the left side of the chart
    top: '40%', // Center it vertically relative to the chart
    transform: [{ rotate: '-90deg' }], // Rotate the text to make it vertical
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  xAxisLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginTop: -40, // Adjust to align correctly under the chart
  },
  container: {
    padding: 20,
    marginTop: 0,
  },
  backgroundImage: {
    width: '100%',
    height: "100%",
  },
  pickerContainer: {
    flexDirection: "row",
    borderRadius: 8,
    // backgroundColor: 'rgba(178, 45, 48, 0.6)',
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
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
    color: '#b22d30',
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
    backgroundColor: 'white',
    paddingVertical: 20,
    gap: 16,
    borderRadius: 20,
  },
  DayText: {
    color: "#B22D30",
    fontSize: 18,
    fontFamily: "ManropeReg"
  },
  dyVi: {
    flexDirection: "column",
    gap: 8
  },
  aqiTxt: {
    fontSize: 24,
    fontWeight: "700",
    color: '#B22D30',
    textAlign: "center",
    fontFamily: ""
  },
  heatMap: {
    width: 400
  },
  heatTxt: {
    fontSize: 18,
    fontWeight: "700",
    color: "#B22D30",
    padding: 4,
  }, 
  htMp: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 20,
    borderRadius: 20,
    flexDirection: "column",
    gap: 6,
    marginBottom: 100
  },
  infoIcon: {
    color: "#B22D30",
    fontFamily: "ManropeReg",
    fontSize: 12
  },
  infoModalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
  },
  infoModalContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
  },
  infoModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoModalText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
  },
  infoModalCloseButton: {
    color: '#b22d30',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // infoIcon: {
  //   fontSize: 18,
  //   color: "white",
  //   fontWeight: "bold",
  // },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    textAlign: "center",
    color: 'white',
    backgroundColor: 'rgba(178, 45, 48, 0.6)',
    maxWidth: 160,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    color: 'white',
    textAlign: "center",
    backgroundColor: 'rgba(178, 45, 48, 0.6)',
  },
};

export default AQITrendsPage;
