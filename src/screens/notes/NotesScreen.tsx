import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { notesStore } from '../../stores/notesStore';
import { userStore } from '../../stores/userStore';
import NoteItem from '../../components/Note';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/appStack';
import { useNavigation } from '@react-navigation/native';
import { Note } from '../../types/models/note';

type NotesScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Main'>;

const NotesScreen = observer(() => {
  const navigation = useNavigation<NotesScreenNavigationProp>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddNote = async () => {
    if (!title.trim()) return;
    await notesStore.addNote(title, description);
    setTitle('');
    setDescription('');
  };

  const navigateToEdit = (noteId: string) => {
    navigation.navigate('EditNote', {noteId: noteId})
  };

  const deleteNote = (noteId: string) => {
    notesStore.deleteNote(noteId);
  };

    const getNoteColor = (note: Note) => {
      if (!note.folderId) return '#393939';
      const folder = notesStore.folders.find(f => f.id === note.folderId);
      return folder?.color || '#393939';
    };

  const sortedNotes = notesStore.userNotes.slice().sort((a, b) => b.createdAt - a.createdAt);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Мои заметки</Text>

      <TextInput
        style={styles.input}
        placeholder="Название"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Описание"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Добавить" onPress={handleAddNote} />

      <FlatList
        data={sortedNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteItem note={item} color={getNoteColor(item)} onEdit= {() => {navigateToEdit(item.id)}} onDelete={() => deleteNote(item.id)} />}
      />

      <Button title="Выйти" color="orange" onPress={() => userStore.logout()} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: '#f9f9f9' },
});

export default NotesScreen;