import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import NoteItem from '../../components/Note';
import { notesStore } from '../../stores/notesStore';
import AddButton from '../../components/AddButton';
import { folderStore } from '../../stores/foldersStore';
import CreateNoteForm from '../../components/forms/note/CreateNoteForm';
import EditNoteForm from '../../components/forms/note/EditNoteForm';

const NotesScreen = observer(() => {
  const [showCreateNoteForm, setShowCreateNoteForm] = useState(false);
  const [showEditNoteForm, setShowEditNoteForm] = useState(false);
  const [formKey, setFormKey] = useState(0); // Ключ для принудительного пересоздания формы
  const [formNoteData, setFormNoteData] = useState<{id: string, title: string, description: string} | null>(null);
  
  const notes = notesStore.userNotes;

  const navigateToEdit = (noteId: string) => {
    const note = notesStore.notes.find(n => n.id === noteId);
    if (note) {
      setFormNoteData({
        id: note.id,
        title: note.title,
        description: note.description || ''
      });
      setFormKey(prev => prev + 1);
      setShowEditNoteForm(true);
    }
  };

  const deleteNote = (noteId: string, noteName: string) => {
    Alert.alert(
      'Удаление заметки',
      `Вы уверены, что хотите удалить заметку '${noteName}'?` ,
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

  const getNoteColor = (note: any) => {
    if (!note.folderId) return '#393939';
    const folder = folderStore.folders.find((f: any) => f.id === note.folderId);
    return folder?.color || '#393939';
  };

  const handleAddNoteSuccess = () => {
    // Можно добавить дополнительную логику при успешном создании
  };

  const handleShowAddForm = () => {
    setShowCreateNoteForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateNoteForm(false);
    setShowEditNoteForm(false);
    setFormNoteData(null);
  };

  return (
    <View style={styles.container}>
      {/* Список заметок */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteItem 
            note={item} 
            color={getNoteColor(item)} 
            onEdit={() => navigateToEdit(item.id)} 
            onDelete={() => deleteNote(item.id, item.title)} 
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Заметок пока нет</Text>
            <Text style={styles.emptySubtext}>Создайте первую заметку</Text>
          </View>
        }
        contentContainerStyle={notes.length === 0 ? styles.emptyContainerCenter : null}
      />

      {/* Кнопка добавления заметки */}
      <AddButton 
        onPress={handleShowAddForm}
        title='Добавить записку'
      />

      {/* Форма создания новой заметки */}
      <CreateNoteForm
        isVisible={showCreateNoteForm}
        onClose={handleCloseForm}
        onAddSuccess={handleAddNoteSuccess}
      />

      {/* Форма редактирования заметки */}
      {formNoteData && (
        <EditNoteForm
          key={formKey}
          noteId={formNoteData.id}
          initialTitle={formNoteData.title}
          initialDescription={formNoteData.description || ''}
          isVisible={showEditNoteForm}
          onClose={handleCloseForm}
          onEditSuccess={handleAddNoteSuccess}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyContainerCenter: {
    flex: 1,
    justifyContent: 'center',
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

export default NotesScreen;