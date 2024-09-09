import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert,ScrollView } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const BusTrackingScreen = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [isTripActive, setIsTripActive] = useState(false);
  const [locationInterval, setLocationInterval] = useState(null);

  const fetchBuses = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // console.log("tokeeeen",token);
      const response = await fetch('https://dev.scholaware.com/demo-api/school-api/bus', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },

      });
      const data = await response.json();
      console.log(token);

      if (response.ok) {
        setBuses(data.items);
      } else {
        Alert.alert('Error', 'Failed to fetch buses');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startTrip = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // console.log("tokeeeen",token);
      const response = await fetch('https://dev.scholaware.com/demo-api/school-api/bus-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ busId: selectedBus }),
      });

      const data = await response.json();
      if (response.ok) {
        setTripId(data.items.id);
        setIsTripActive(true);
        startLocationUpdates();
        Alert.alert('Trip Started', `Trip ID: ${data.items.id}`);
      } else {
        Alert.alert('Error', 'Failed to start trip');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const endTrip = () => {
    if (locationInterval) {

      clearInterval(locationInterval);
    }
    setIsTripActive(false);
    Alert.alert('Trip Ended', 'Location updates stopped');
  };

  const startLocationUpdates = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to track the bus');
      return;
    }

    setLocationInterval(setInterval(async () => {
      const location = await Location.getCurrentPositionAsync({});
      console.log('Location:', location.coords.latitude, location.coords.longitude);
      saveLocation(location.coords.latitude, location.coords.longitude);
    }, 30000));
  };

  const saveLocation = async (lat, long) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // console.log("tokeeeen",token);
      const response = await fetch('https://dev.scholaware.com/demo-api/school-api/bus-trip-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          lat: lat.toString(),
          longt: long.toString(),
          tripId: tripId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Failed to save location', data);
      }
      Alert.alert('Location Saved', 'Location updated successfully');
    } catch (error) {
      console.error('Error saving location', error);
    }
    
  };

  useEffect(() => {
    fetchBuses();
    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
  }, []);

  return (
    
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
    <ScrollView 
      contentContainerStyle={{ 
        flexGrow: 1, 
        justifyContent: 'start', 
        alignItems: 'center', 
        padding: 20 
      }}
    >
      <View style={{ 
        width: '100%', 
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 10, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 5, 
        elevation: 3 
      }}>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold', 
          color: '#333', 
          textAlign: 'center', 
          marginBottom: 20 
        }}>
          Start Trip
        </Text>
  
        <Picker
          selectedValue={selectedBus}
          onValueChange={(itemValue) => setSelectedBus(itemValue)}
          style={{ 
            height: 50, 
            width: '100%', 
            borderColor: '#ccc', 
            borderWidth: 1, 
            marginBottom: 20 
          }}
        >
          {buses.map((bus) => (
            <Picker.Item key={bus.id} label={bus.description} value={bus.id} />
          ))}
        </Picker>
  
        <Button
          title={isTripActive ? 'End Trip' : 'Start Trip'}
          onPress={isTripActive ? endTrip : startTrip}
          disabled={!selectedBus}
        />
      </View>
    </ScrollView>
  </SafeAreaView>  
  );
};

export default BusTrackingScreen;
