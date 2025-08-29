import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AddButtonProps {
  onPress: () => void;
  title: string;
}

const AddButton = ({ onPress, title }: AddButtonProps) => {
  return (
    <TouchableOpacity 
      style={styles.addFolderButton}
      onPress={onPress}
    >
      <Text style={styles.addFolderButtonText}>+</Text>
      <Text style={styles.addFolderButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addFolderButton: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor:  '#8A2BE2', //'#FFA500',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addFolderButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AddButton;