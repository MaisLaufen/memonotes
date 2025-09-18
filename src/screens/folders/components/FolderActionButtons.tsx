import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FolderActionButtonsProps {
  onAddNotePress: () => void;
  onAddFolderPress: () => void;
  onAddSummaryPress: () => void;
}

export const FolderActionButtons: React.FC<FolderActionButtonsProps> = ({ 
  onAddNotePress, 
  onAddFolderPress, 
  onAddSummaryPress 
}) => {
  return (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onAddNotePress}
      >
        <Text style={styles.actionButtonText}>📝</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onAddFolderPress}
      >
        <Text style={styles.actionButtonText}>📁</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onAddSummaryPress}
      >
        <Text style={styles.actionButtonText}>📚</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 24,
  },
});