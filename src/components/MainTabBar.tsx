import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TabBarItem {
  key: string;
  label: string;
}

interface MainTabBarProps {
  tabs: TabBarItem[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
}

const MainTabBar = ({ tabs, activeTab, onTabPress }: MainTabBarProps) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onTabPress(tab.key)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
          {activeTab === tab.key && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    color: '#888', // Серый цвет для неактивных табов
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff', // Белый цвет для активного таба
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '60%',
    height: 3,
    backgroundColor: '#8A2BE2', // Фиолетовая полоска
    borderRadius: 2,
  },
});

export default MainTabBar;