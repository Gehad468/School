import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card, Title } from 'react-native-paper';
import { useCameraPermissions } from 'expo-camera';

const HomeScreen = () => {
    const [roles, setRoles] = useState([]);
    const [isBusTrackingEnabled, setIsBusTrackingEnabled] = useState(false);
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const isCameraPermissionGranted = Boolean(permission?.granted);

    useEffect(() => {
        const checkUserRoles = async () => {
            const storedRoles = await AsyncStorage.getItem('roles');
            if (storedRoles) {
                const parsedRoles = JSON.parse(storedRoles);
                console.log(parsedRoles);
                setRoles(parsedRoles);
                setIsBusTrackingEnabled(parsedRoles.includes('13'));
            }
        };

        checkUserRoles();
    }, []);
    const handleScan = () => {
        if (isCameraPermissionGranted) {
            navigation.navigate('Scan');
        } else {
            Alert.alert('Camera permission required', 'You need camera permission to scan QR codes.');
        }
    };

   

    const handleBusTracking = () => {
        navigation.navigate('BusTracking');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Card style={styles.Container}>
                    <Card.Content>
                        <Title style={styles.headerText}>Home Screen</Title>
                        {isBusTrackingEnabled && (
                            <Button
                                mode="contained"
                                onPress={handleBusTracking}
                                style={styles.button}
                            >
                                Bus Tracking
                            </Button>
                        )}
                    <Button
      mode="contained"
      onPress={handleScan}
      disabled={!isCameraPermissionGranted}
      style={{
        backgroundColor: isCameraPermissionGranted ? 'black' : 'red',
        marginTop: 20,
      }}
    >
      Scan Code
    </Button>
                    </Card.Content>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Container: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        marginTop: 20,
    },
});

export default HomeScreen;
