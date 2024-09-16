import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './pages/LandingPage';
import DetailsPage from './pages/DetailsPage';
import AQITrendsPage from './pages/AQITrends';
import NewsPage from './pages/NewsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import Indoor from './pages/IndoorPage';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{ headerShown: false }} // Hides default header
        />
        <Stack.Screen
          name="DetailsPage"
          component={DetailsPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Trend"
          component={AQITrendsPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="News"
          component={NewsPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Recommend"
          component={RecommendationsPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Indoor"
          component={Indoor}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
