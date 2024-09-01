import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you are using Expo, or replace with the appropriate icon library
import * as Font from "expo-font";

const BottomNavBar = ({ navigation }) => {

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

  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('LandingPage')}>
        <Ionicons name="home-outline" size={24} color="#b22d30" />
        <Text style={styles.navText}>home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('News')}>
        <Ionicons name="newspaper-outline" size={24} color="#b22d30" />
        <Text style={styles.navText}>news</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Ideas')}>
        <Ionicons name="bulb-outline" size={24} color="#b22d30" />
        <Text style={styles.navText}>ideas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Trend')}>
        <Ionicons name="pie-chart-outline" size={24} color="#b22d30" />
        <Text style={styles.navText}>insights</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    width: '95%',
    marginBottom: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: -1 },
    shadowRadius: 12,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#b22d30',
    fontSize: 12,
    marginTop: 4,
    fontFamily: "ManroperExtraL",
  },
});

export default BottomNavBar;
