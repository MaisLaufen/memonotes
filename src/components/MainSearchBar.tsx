import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';

interface MainSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

const MainSearchBar = ({ 
  value, 
  onChangeText, 
  onSearch,
  placeholder = "Поиск заметок..." 
}: MainSearchBarProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
      />
      <TouchableOpacity 
        style={styles.searchButton} 
        onPress={onSearch}
      >
        <Text style={styles.searchIcon}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    position: 'relative',
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchButton: {
    position: 'absolute',
    right: 8,
    backgroundColor: '#8A2BE2', // Фиолетовый цвет
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  searchIcon: {
    fontSize: 16,
    color: '#fff',
  },
});

export default MainSearchBar;