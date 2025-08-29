import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { notesStore } from '../../stores/notesStore';
import { userStore } from '../../stores/userStore';

const NotesScreen = observer(() => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddNote = async () => {
    if (!title.trim()) return;
    await notesStore.addNote(title, description);
    console.log("Note added");
    setTitle('');
    setDescription('');
  };

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
        data={notesStore.userNotes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={styles.status}>Статус: {item.status}</Text>
            <Button
              title="Удалить"
              color="red"
              onPress={() => notesStore.deleteNote(item.id)}
            />
                  <Button title="Выйти" onPress={() => userStore.logout()} />
            
            
          </View>
        )}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  note: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  title: { fontWeight: 'bold' },
  status: { fontStyle: 'italic', marginTop: 5 },
});

export default NotesScreen;
