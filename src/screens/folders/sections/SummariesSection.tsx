import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { summariesStore } from '../../../stores/summariesStore';

interface SummariesSectionProps {
  summaries: any[];
  onEditSummary: (summaryId: string) => void;
  onDeleteSummary: (summaryId: string) => void;
}

export const SummariesSection: React.FC<SummariesSectionProps> = ({ 
  summaries, 
  onEditSummary, 
  onDeleteSummary 
}) => {
  if (summaries.length === 0) return null;

  const handleDeleteSummary = (summaryId: string) => {
    Alert.alert(
      'Удаление конспекта',
      'Вы уверены, что хотите удалить этот конспект?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => summariesStore.deleteSummary(summaryId)
        }
      ]
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Конспекты</Text>
      <View style={styles.itemsContainer}>
        {summaries.map((summary: any) => (
          <View key={summary.id} style={styles.itemWrapper}>
            <TouchableOpacity 
              style={styles.summaryItem}
              onPress={() => onEditSummary(summary.id)}
            >
              <Text style={styles.summaryTitle} numberOfLines={2}>
                {summary.title || 'Без названия'}
              </Text>
              <Text style={styles.summaryPreview} numberOfLines={2}>
                {summary.content.replace(/[#*`]/g, '').substring(0, 60)}
                {summary.content.length > 60 ? '...' : ''}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteItemButton}
              onPress={() => handleDeleteSummary(summary.id)}
            >
              <Text style={styles.deleteItemButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  itemsContainer: {
    paddingHorizontal: 16,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  summaryPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  deleteItemButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteItemButtonText: {
    fontSize: 24,
    color: '#ff6b6b',
    fontWeight: '300',
  },
});