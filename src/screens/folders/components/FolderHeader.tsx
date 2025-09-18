import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FolderHeaderProps {
  folderName: string;
  folderColor: string;
  folderNotes: any[];
  folderSummaries: any[];
  onBackPress: () => void;
}

export const FolderHeader: React.FC<FolderHeaderProps> = ({ 
  folderName, 
  folderColor, 
  folderNotes, 
  folderSummaries, 
  onBackPress 
}) => {
  return (
    <View style={[styles.header, { backgroundColor: folderColor }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBackPress}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.folderTitle} numberOfLines={1}>{folderName}</Text>
        <Text style={styles.folderStats}>
          {folderNotes.length + folderSummaries.length} элементов
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: 'white',
  },
  headerContent: {
    flex: 1,
  },
  folderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  folderStats: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
});