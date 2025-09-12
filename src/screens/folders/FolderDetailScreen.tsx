import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView, SafeAreaView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation, useRoute } from '@react-navigation/native';
import { notesStore } from '../../stores/notesStore';
import NoteItem from '../../components/Note';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/appStack';
import { summariesStore } from '../../stores/summariesStore';
import { folderStore } from '../../stores/foldersStore';
import AddNoteForm from '../../components/forms/AddNoteForm';
import AddFolderForm from '../../components/forms/AddFolderForm';

type FolderDetailScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'FolderDetail'>;

const FolderDetailScreen = observer(() => {
  const navigation = useNavigation<FolderDetailScreenNavigationProp>();
  const route = useRoute();
  const { folderId, folderName, folderColor, parentFolderId } = route.params as { 
    folderId: string; 
    folderName: string;
    folderColor: string;
    parentFolderId?: string;
  };

  const subFolders = folderStore.getSubFolders(folderId);
  const folderNotes = notesStore.getNotesByFolder(folderId);
  const folderSummaries = summariesStore.getSummariesByFolder(folderId);

  // Состояния форм
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [showAddFolderForm, setShowAddFolderForm] = useState(false);

  // Навигация назад с учетом иерархии
  const handleGoBack = () => {
    if (parentFolderId) {
      const parentFolder = folderStore.getFolderById(parentFolderId);
      if (parentFolder) {
        navigation.navigate('FolderDetail', {
          folderId: parentFolder.id,
          folderName: parentFolder.name,
          folderColor: parentFolder.color || '#ff0000',
          parentFolderId: parentFolder.parentId || null
        });
      } else {
        navigation.goBack();
      }
    } else {
      navigation.goBack();
    }
  };

  // Переход к редактированию заметки
  const handleEditNote = (noteId: string) => {
    navigation.navigate('EditNote', { noteId });
  };

  // Удаление заметки
  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Удаление заметки',
      'Вы уверены, что хотите удалить эту заметку?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => notesStore.deleteNote(noteId)
        }
      ]
    );
  };

  // Переход к редактированию конспекта
  const handleEditSummary = (summaryId: string) => {
    const summary = summariesStore.getSummaryById(summaryId);
    if (summary) {
      navigation.navigate('EditSummary', {
        summaryId: summary.id
      });
    }
  };

  // Удаление конспекта
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

  // Переход в подпапку
  const handleNavigateToFolder = (folder: any) => {
    navigation.navigate('FolderDetail', {
      folderId: folder.id,
      folderName: folder.name,
      folderColor: folder.color || '#ff0000',
      parentFolderId: folder.parentId || folderId
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: folderColor }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
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

      {/* Кнопки добавления */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowAddNoteForm(true)}
        >
          <Text style={styles.actionButtonText}>📝</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowAddFolderForm(true)}
        >
          <Text style={styles.actionButtonText}>📁</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            navigation.navigate('EditSummary', {
              summaryId: undefined,
              folderId: folderId
            });
          }}
        >
          <Text style={styles.actionButtonText}>📚</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Подпапки */}
        {subFolders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Подпапки</Text>
            <View style={styles.foldersGrid}>
              {subFolders.map(folder => (
                <TouchableOpacity 
                  key={folder.id}
                  style={styles.folderCard}
                  onPress={() => handleNavigateToFolder(folder)}
                >
                  <View style={[styles.folderColorBar, { backgroundColor: folder.color || '#ff0000' }]} />
                  <View style={styles.folderCardContent}>
                    <Text style={styles.folderName} numberOfLines={2}>
                      {folder.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Конспекты */}
        {folderSummaries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Конспекты</Text>
            <View style={styles.itemsContainer}>
              {folderSummaries.map((summary: any) => (
                <View key={summary.id} style={styles.itemWrapper}>
                  <TouchableOpacity 
                    style={styles.summaryItem}
                    onPress={() => handleEditSummary(summary.id)}
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
        )}

        {/* Заметки */}
        {folderNotes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Заметки</Text>
            <View style={styles.itemsContainer}>
              {folderNotes.map((note: any) => (
                <View key={note.id} style={styles.itemWrapper}>
                  <NoteItem 
                    note={note} 
                    color='#4ECDC4'
                    onEdit={() => handleEditNote(note.id)} 
                    onDelete={() => handleDeleteNote(note.id)} 
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Пустое состояние */}
        {subFolders.length === 0 && folderNotes.length === 0 && folderSummaries.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Папка пуста</Text>
            <Text style={styles.emptySubtext}>Добавьте заметки, конспекты или подпапки</Text>
          </View>
        )}
      </ScrollView>

      {/* Модальные формы */}
      <AddNoteForm
        folderId={folderId}
        isVisible={showAddNoteForm}
        onClose={() => setShowAddNoteForm(false)}
      />

      <AddFolderForm
        folderId={folderId}
        isVisible={showAddFolderForm}
        onClose={() => setShowAddFolderForm(false)}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  folderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  folderStats: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#1e1e1e',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2d2d2d',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  activeActionButton: {
    backgroundColor: '#007AFF',
    transform: [{ scale: 1.1 }],
  },
  actionButtonText: {
    fontSize: 20,
  },
  addForm: {
    backgroundColor: '#1e1e1e',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  formInput: {
    backgroundColor: '#2d2d2d',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  formTextarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  formCancelButton: {
    flex: 1,
    backgroundColor: '#3d3d3d',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  formCancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  formSaveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  formSaveButtonDisabled: {
    backgroundColor: '#3d3d3d',
  },
  formSaveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  colorLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  colorPicker: {
    marginBottom: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#fff',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  foldersGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  folderCard: {
    width: '48%',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginRight: '2%',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    overflow: 'hidden',
  },
  folderColorBar: {
    height: 4,
    width: '100%',
  },
  folderCardContent: {
    padding: 12,
  },
  folderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 20,
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
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
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
    lineHeight: 20,
  },
  deleteItemButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteItemButtonText: {
    fontSize: 24,
    color: '#ff4444',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default FolderDetailScreen;