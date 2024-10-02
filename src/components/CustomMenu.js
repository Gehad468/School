// components/DrawerMenu.js
import React, { useState } from 'react';
import { Drawer, Button } from 'react-native-paper';

const DrawerMenu = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 
  const [active, setActive] = useState('dashboard');

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen); 
  };

  return (
    <>
      <Button onPress={toggleDrawer}>
        {isDrawerOpen ? 'Close Menu' : 'Open Menu'}
      </Button>

      {isDrawerOpen && (
        <Drawer.Section title="Menu">
          <Drawer.Item
            label="Dashboard"
            active={active === 'dashboard'}
            onPress={() => setActive('dashboard')}
          />
          <Drawer.Item
            label="Profile"
            active={active === 'profile'}
            onPress={() => setActive('profile')}
          />
          <Drawer.Item
            label="Settings"
            active={active === 'settings'}
            onPress={() => setActive('settings')}
          />
        </Drawer.Section>
      )}
    </>
  );
};

export default DrawerMenu;
