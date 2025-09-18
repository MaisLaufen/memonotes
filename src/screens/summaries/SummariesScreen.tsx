import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/appStack';
import { summariesStore } from '../../stores/summariesStore';
import AddButton from '../../components/AddButton';
import SummaryItem from '../../components/items/Summary';

type SummariesScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Main'>;

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
        contentContainerStyle={summaries.length === 0 ? styles.emptyContainerCenter : {}}
        showsVerticalScrollIndicator={false}
      />
      <AddButton title="Добавить конспект" onPress={navigateToCreate} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16
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
});

export default SummariesScreen;