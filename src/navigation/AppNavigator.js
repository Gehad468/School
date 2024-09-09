import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import StartTripScreen from '../screens/BusTrackingScreen';
import LoginScreen from '../screens/LoginScreen';
import TestFetchScreen from '../screens/HomeScreen';

import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" >
                <Stack.Screen name="Login" component={LoginScreen}  options={{headerShown:false}}/>
                <Stack.Screen name="BusTracking" component={StartTripScreen} options={{headerShown:false}} />
                <Stack.Screen name="Home" component={TestFetchScreen} options={{headerShown:false}} />
            </Stack.Navigator>
            <StatusBar backgroundColor='#161622'> </StatusBar>
        </NavigationContainer>
    );
};

export default AppNavigator;
