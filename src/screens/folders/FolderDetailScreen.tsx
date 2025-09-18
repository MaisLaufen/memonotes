import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation, useRoute } from '@react-navigation/native';
import { notesStore } from '../../stores/notesStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/appStack';
import { summariesStore } from '../../stores/summariesStore';
import { folderStore } from '../../stores/foldersStore';
import AddNoteForm from '../../components/forms/note/CreateNoteForm';
import AddFolderForm from '../../components/forms/folder/CreateFolderForm';
import { EmptyState } from './sections/EmptyState';
import { NotesSection } from './sections/NotesSection';
import { SummariesSection } from './sections/SummariesSection';
import { SubFoldersSection } from './sections/SubFoldersSection';
import { FolderActionButtons } from './components/FolderActionButtons';
import { FolderHeader } from './components/FolderHeader';
import { v4 as uuid } from 'uuid';
import CreateFolderForm from '../../components/forms/folder/CreateFolderForm';
import EditFolderForm from '../../components/forms/folder/EditFolderForm';
import CreateNoteForm from '../../components/forms/note/CreateNoteForm';
import EditNoteForm from '../../components/forms/note/EditNoteForm';

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

  const [showCreateNoteForm, setShowCreateNoteForm] = useState(false);
  const [showEditNoteForm, setShowEditNoteForm] = useState(false);
  
  const [showEditFolderForm, setShowEditFolderForm] = useState(false);
  const [showCreateFolderForm, setShowCreateFolderForm] = useState(false);
  
  const [formFolderData, setFormFolderData] = useState<{id: string, name: string, color: string} | null>(null);
  const [editNoteData, setEditNoteData] = useState<{id: string, title: string, description: string} | null>(null);

  const [formKey, setFormKey] = useState(0);

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

  // Переход в подпапку
  const handleNavigateToFolder = (folder: any) => {
    navigation.navigate('FolderDetail', {
      folderId: folder.id,
      folderName: folder.name,
      folderColor: folder.color || '#ff0000',
      parentFolderId: folder.parentId || folderId  // <-- ВАЖНО: folderId как fallback
    });
  };

  // Редактирование папки
  const handleEditFolder = (folder: any) => {
    setFormFolderData({
      id: folder.id,
      name: folder.name,
      color: folder.color
    });
    setFormKey(prev => prev + 1);
    setShowEditFolderForm(true);
  };

  // Создание новой папки
  const handleAddFolder = () => {
    setFormFolderData(null);
    setShowCreateFolderForm(true);
  }

  // Удаление папки
  const handleDeleteFolder = (folderId: string) => {
    Alert.alert(
      'Удаление папки',
      'Вы уверены, что хотите удалить эту папку? Все заметки из этой папки будут перемещены в "Все заметки".',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => folderStore.deleteFolder(folderId)
        }
      ]
    );
  };

  const handleEditNote = (note: any) => {
    setEditNoteData({
      id: note.id,
      title: note.title,
      description: note.description || ''
    });
    setFormKey(prev => prev + 1);
    setShowEditNoteForm(true);
  };

  useEffect(() => {
    // Этот эффект сработает при изменении subFolders
    // Можно добавить дополнительную логику если нужно
  }, [subFolders]);

  return (
    <SafeAreaView style={styles.container}>
      <FolderHeader
        folderName={folderName}
        folderColor={folderColor}
        folderNotes={folderNotes}
        folderSummaries={folderSummaries}
        onBackPress={handleGoBack}
      />

      <FolderActionButtons
        onAddNotePress={() => setShowCreateNoteForm(true)}
        onAddFolderPress={() => setShowCreateFolderForm(true)}
        onAddSummaryPress={() => {
          navigation.navigate('EditSummary', {
            summaryId: undefined,
            folderId: folderId
          });
        }}
      />

      <ScrollView style={styles.content}>
        <SubFoldersSection
          subFolders={subFolders}
          onFolderPress={handleNavigateToFolder}
          onEditFolder={handleEditFolder}
          onDeleteFolder={handleDeleteFolder}
        />
        <SummariesSection
          summaries={folderSummaries}
          onEditSummary={(summaryId) => {
            const summary = summariesStore.getSummaryById(summaryId);
            if (summary) {
              navigation.navigate('EditSummary', {
                summaryId: summary.id
              });
            }
          }}
          onDeleteSummary={(summaryId) => {
            // Alert logic moved to component
          }}
        />

        <NotesSection
          notes={folderNotes}
          onEditNote={handleEditNote}
          onDeleteNote={(noteId) => {
            // Alert logic moved to component
          }}
        />

        <EmptyState
          show={subFolders.length === 0 && folderNotes.length === 0 && folderSummaries.length === 0}
        />
      </ScrollView>

      {/* Модальные формы */}
      <CreateNoteForm
        folderId={folderId}
        isVisible={showCreateNoteForm}
        onClose={() => setShowCreateNoteForm(false)}
      />

      {editNoteData && (
        <EditNoteForm
          key={formKey}
          noteId={editNoteData.id}
          initialTitle={editNoteData.title}
          initialDescription={editNoteData.description || ''}
          isVisible={showEditNoteForm}
          onClose={() => {
            setShowEditNoteForm(false);
            setEditNoteData(null);
          }}
        />
      )}

      <CreateFolderForm
        parentId={folderId}
        isVisible={showCreateFolderForm && !formFolderData}
        onClose={() => setShowCreateFolderForm(false)}
      />

      {formFolderData && (
        <EditFolderForm
          key={formKey}
          folderId={formFolderData.id}
          initialName={formFolderData.name}
          initialColor={formFolderData.color}
          isVisible={showEditFolderForm}
          onClose={() => {
            setShowEditFolderForm(false);
            setFormFolderData(null);
          }}
        />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});

export default FolderDetailScreen;