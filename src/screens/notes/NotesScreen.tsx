import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import NoteItem from '../../components/Note';
import { AppStackParamList } from '../../navigation/appStack';
import { Note } from '../../types/models/note';
import { notesStore } from '../../stores/notesStore';
import AddButton from '../../components/AddButton';
import { folderStore } from '../../stores/foldersStore';

type NotesScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Main'>;

const NotesScreen = observer(() => {
  const navigation = useNavigation<NotesScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const handleMenuPress = () => {
    // Логика меню
  };

  const handleSearch = () => {
    // Логика поиска
  };


  const navigateToEdit = (noteId: string) => {
    navigation.navigate('EditNote', { noteId });
  };

  const deleteNote = (noteId: string) => {
    notesStore.deleteNote(noteId);
  };

  const getNoteColor = (note: Note) => {
    if (!note.folderId) return '#393939';
    const folder = folderStore.folders.find(f => f.id === note.folderId);
    return folder?.color || '#393939';
  };

  // Фильтрация заметок по поиску и папке
  const filteredNotes = notesStore.userNotes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFolder = selectedFolder ? note.folderId === selectedFolder : true;
      return matchesSearch && matchesFolder;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <View style={styles.container}>

      {/* Список заметок */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteItem 
            note={item} 
            color={getNoteColor(item)} 
            onEdit={() => navigateToEdit(item.id)} 
            onDelete={() => deleteNote(item.id)} 
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Заметок пока нет</Text>
            <Text style={styles.emptySubtext}>Создайте первую заметку</Text>
          </View>
        }
        contentContainerStyle={filteredNotes.length === 0 ? styles.emptyContainerCenter : null}
      />
      <AddButton onPress={() => navigation.navigate('CreateNote')} title='Добавить записку'/>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8A2BE2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NotesScreen;