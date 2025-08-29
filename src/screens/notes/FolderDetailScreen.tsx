import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation, useRoute } from '@react-navigation/native';
import { notesStore } from '../../stores/notesStore';
import NoteItem from '../../components/Note';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/appStack';

type FolderDetailScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'FolderDetail'>;


const FolderDetailScreen = observer(() => {
  const navigation = useNavigation<FolderDetailScreenNavigationProp>();
  const route = useRoute();
  const { folderId, folderName, folderColor } = route.params as { 
    folderId: string; 
    folderName: string;
    folderColor: string;
  };

  const folderNotes = notesStore.getNotesByFolder(folderId);

  const handleEditNote = (noteId: string) => {
    navigation.navigate('EditNote', { noteId });
  };

  const handleDeleteNote = (noteId: string) => {
    notesStore.deleteNote(noteId);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: folderColor }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.folderTitle}>{folderName}</Text>
        <Text style={styles.noteCount}>{folderNotes.length} заметок</Text>
      </View>

      {folderNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>В этой папке пока нет заметок</Text>
          <Text style={styles.emptySubtext}>Добавьте заметки в эту папку через основной список</Text>
        </View>
      ) : (
        <FlatList
          data={folderNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteItem 
              note={item} 
              color='#ff00ff'
              onEdit={() => handleEditNote(item.id)} 
              onDelete={() => handleDeleteNote(item.id)} 
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  folderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  noteCount: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
});

export default FolderDetailScreen;