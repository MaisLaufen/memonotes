import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EmptyStateProps {
  show: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ show }) => {
  if (!show) return null;

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Папка пуста</Text>
      <Text style={styles.emptySubtext}>Добавьте заметки, конспекты или подпапки</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});