import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Drawer, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const DrawerMenu = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigation = useNavigation();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen); 
  };

  return (
    <View style={styles.container}>
      {/* Button to toggle Drawer */}
      <Button
        icon={isDrawerOpen ? 'close' : 'menu'}
        onPress={toggleDrawer}
        style={styles.menuButton}
      />

      {/* Drawer */}
      {isDrawerOpen && (
        <DrawerContentScrollView style={styles.drawer}>
          <Drawer.Section>
            <Drawer.Item
              label="Dashboard"
              onPress={() => {
                setIsDrawerOpen(false);
                navigation.navigate('Dashboard');
              }}
            />
            <Drawer.Item
              label="Profile"
              onPress={() => {
                setIsDrawerOpen(false);
                navigation.navigate('Profile');
              }}
            />
            <Drawer.Item
              label="Settings"
              onPress={() => {
                setIsDrawerOpen(false);
                navigation.navigate('Settings');
              }}
            />
          </Drawer.Section>
        </DrawerContentScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuButton: {
    margin: 10,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#fff',
    elevation: 4,
  },
});

export default DrawerMenu;
