import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Camera, CameraView } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      console.log('Camera permission status:', status);
    })();
  }, []);



  const handleBarCodeScanned = ({ type, data }) => {
    setScannedData(data);
    console.log(`QR code with type ${type} and data ${data} has been scanned!`);
    setScanned(true);

  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;

  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {!scanned ? (
        <>
          <CameraView style={StyleSheet.absoluteFillObject} facing='back' onBarcodeScanned={handleBarCodeScanned} />
          <View style={styles.overlayContainer}>
            <View style={styles.topOverlay} />
            <View style={styles.middleOverlay}>
              <View style={styles.sideOverlay} />
              <View style={styles.focusedContainer} />
              <View style={styles.sideOverlay} />
            </View>
            <View style={styles.bottomOverlay} />
          </View>
        </>) : (
        <View style={styles.container}>
          <Text>Scanned data: {scannedData}</Text>
          <Button mode="elevated"
            onPress={() => setScanned(false)} >Scan QR Code Again</Button>
        </View>
      )}
    </SafeAreaView>
  );
}

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  middleOverlay: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  sideOverlay: {
    flex: 1,
    height: 250,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  focusedContainer: {
    width: 250,
    height: 250,
    borderColor: '#fff',
    borderWidth: 2,
    backgroundColor: 'transparent',
    // borderRadius: 15,
  },
  bottomOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
