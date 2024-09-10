import React, { useState } from 'react';
import { Menu, Appbar } from 'react-native-paper';

const CustomMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="menu" color="black" onPress={openMenu} />}
      >
        <Menu.Item onPress={() => {}} title="Dashboard" />
        <Menu.Item onPress={() => {}} title="Profile" />
        <Menu.Item onPress={() => {}} title="Settings" />
      </Menu>
    </>
  );
};

export default CustomMenu;
