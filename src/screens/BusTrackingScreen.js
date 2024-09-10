import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, Card, Title, Dialog, Portal, Provider, Appbar, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import CustomMenu from '../components/CustomMenu';
import { SCHOOL_API_BASE_URL } from '@env';


const BusTrackingScreen = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [isTripActive, setIsTripActive] = useState(false);
  const [locationInterval, setLocationInterval] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [busDialogVisible, setBusDialogVisible] = useState(false);

  const fetchBuses = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${SCHOOL_API_BASE_URL}/bus`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBuses(data.items);
      } else {
        showAlert('Error', 'Failed to fetch buses');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startTrip = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${SCHOOL_API_BASE_URL}/bus-trip`, {
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
        showAlert('Trip Started', `Trip ID: ${data.items.id}`);
      } else {
        showAlert('Error', 'Failed to start trip');
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
    showAlert('Trip Ended', 'Location updates stopped');
  };

  const startLocationUpdates = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permission Denied', 'Location permission is required to track the bus');
      return;
    }

    setLocationInterval(setInterval(async () => {
      const location = await Location.getCurrentPositionAsync({});
      saveLocation(location.coords.latitude, location.coords.longitude);
    }, 30000));
  };

  const saveLocation = async (lat, long) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${SCHOOL_API_BASE_URL}/bus-trip-location`, {
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
        console.error('Failed to save location');
      }
      showAlert('Location Saved', 'Location updated successfully');
    } catch (error) {
      console.error('Error saving location', error);
    }
  };

  const showAlert = (title, message) => {
    setAlertMessage(`${title}: ${message}`);
    setAlertVisible(true);
  };



  const openBusDialog = () => setBusDialogVisible(true);
  const closeBusDialog = () => setBusDialogVisible(false);

  const selectBus = (bus) => {
    setSelectedBus(bus.id);
    closeBusDialog();
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
    <Provider>
      <SafeAreaView style={styles.safeArea}>
      <Appbar.Header>
          <Appbar.Content title="Bus" />
          <CustomMenu />
        </Appbar.Header>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Start Trip</Title>

              <Button mode="outlined" onPress={openBusDialog} style={styles.button}>
                {selectedBus ? `Selected Bus: ${buses.find(bus => bus.id === selectedBus)?.description}` : 'Select Bus'}
              </Button>

              <Button
                mode="contained"
                onPress={isTripActive ? endTrip : startTrip}
                disabled={!selectedBus}
                style={styles.button}
              >
                {isTripActive ? 'End Trip' : 'Start Trip'}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>

        <Portal>
          <Dialog visible={busDialogVisible} onDismiss={closeBusDialog}>
            <Dialog.Title>Select a Bus</Dialog.Title>
            <Dialog.Content>
              {buses.map((bus) => (
                <List.Item
                  key={bus.id}
                  title={bus.description}
                  onPress={() => selectBus(bus)}
                  left={() => <List.Icon icon="bus" />}
                />
              ))}
            </Dialog.Content>
          </Dialog>

          <Dialog visible={alertVisible} onDismiss={() => setAlertVisible(false)}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Text>{alertMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setAlertVisible(false)}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default BusTrackingScreen;
