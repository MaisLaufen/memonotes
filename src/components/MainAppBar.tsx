import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomAppBarProps {
  onMenuPress?: () => void;
}

const MainAppBar = ({ onMenuPress }: CustomAppBarProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>memonotes (Notra)</Text>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Text style={styles.menuIcon}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 5,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'SFProDisplay-Regular', // Если установлен SF Pro
  },
  menuButton: {
    //padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#fff',
  },
});

export default MainAppBar;