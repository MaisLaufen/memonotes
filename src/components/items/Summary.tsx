// components/SummaryItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Summary } from '../../types/models/summary';

interface SummaryItemProps {
  summary: Summary;
  onEdit: () => void;
  onDelete: () => void;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ summary, onEdit, onDelete }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onEdit}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {summary.title || 'Без названия'}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {summary.content.substring(0, 100)}...
        </Text>
        <Text style={styles.date}>
          Обновлено: {formatDate(summary.updatedAt)}
        </Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
});

export default SummaryItem;