import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/appStack';
import { Summary } from '../../types/models/summary';
import { summariesStore } from '../../stores/summariesStore';
import AddButton from '../../components/AddButton';

type SummariesScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Main'>;

// Компонент элемента конспекта
const SummaryItem = observer(({ 
  summary, 
  onEdit, 
  onDelete 
}: { 
  summary: Summary; 
  onEdit: () => void; 
  onDelete: () => void; 
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <View style={styles.summaryItem}>
      <TouchableOpacity style={styles.summaryContent} onPress={onEdit}>
        <Text style={styles.summaryTitle} numberOfLines={2}>
          {summary.title || 'Без названия'}
        </Text>
        <Text style={styles.summaryPreview} numberOfLines={3}>
          {summary.content.replace(/[#*`]/g, '').substring(0, 100)}
          {summary.content.length > 100 ? '...' : ''}
        </Text>
        <Text style={styles.summaryDate}>
          {formatDate(summary.updatedAt)}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
});

const SummariesScreen = observer(() => {
  const navigation = useNavigation<SummariesScreenNavigationProp>();

  const navigateToEdit = (summaryId: string) => {
    const summary = summariesStore.getSummaryById(summaryId);
    if (summary) {
      navigation.navigate('EditSummary', { 
        summaryId: summary.id,
      });
    }
  };

  const navigateToCreate = () => {
    navigation.navigate('EditSummary', {
      summaryId: undefined,
    });
  };

  const deleteSummary = (summaryId: string) => {
    summariesStore.deleteSummary(summaryId);
  };

  // Фильтрация конспектов по поиску
  const summaries = summariesStore.userSummaries

  return (
    <View style={styles.container}>

      {/* Список конспектов */}
      <FlatList
        data={summaries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SummaryItem 
            summary={item} 
            onEdit={() => navigateToEdit(item.id)} 
            onDelete={() => deleteSummary(item.id)} 
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
              <Text style={styles.emptySubtext}>Создайте первый конспект</Text>
          </View>
        }
        contentContainerStyle={summaries.length === 0 ? styles.emptyContainerCenter : styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <AddButton title="Добавить конспект" onPress={navigateToCreate} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#1e1e1e',
  },
  searchInput: {
    backgroundColor: '#2d2d2d',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyContainerCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
  },
  summaryItem: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryContent: {
    flex: 1,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  summaryPreview: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
    lineHeight: 20,
  },
  summaryDate: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 24,
    color: '#ff4444',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 32,
    color: '#fff',
    lineHeight: 36,
  },
});

export default SummariesScreen;