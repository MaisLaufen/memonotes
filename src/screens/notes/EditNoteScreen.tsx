import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { notesStore } from '../../stores/notesStore';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../../navigation/appStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type EditNoteRouteProp = RouteProp<AppStackParamList, 'EditNote'>;
type EditNoteNavigationProp = NativeStackNavigationProp<AppStackParamList, 'EditNote'>;

const EditNoteScreen = observer(() => {
  const route = useRoute<EditNoteRouteProp>();
  const navigation = useNavigation<EditNoteNavigationProp>();

  const noteId = route.params.noteId;
  const note = notesStore.notes.find(n => n.id === noteId);

  const [title, setTitle] = useState(note?.title || '');
  const [description, setDescription] = useState(note?.description || '');

  const handleSave = async () => {
    if (!note) return;
    await notesStore.updateNote(note.id, { title, description });
    navigation.goBack();
  };

  useEffect(() => {
    if (!note) navigation.goBack();
  }, [note]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Редактирование заметки</Text>

      <TextInput style={styles.input} placeholder="Название" value={title} onChangeText={setTitle} />
      <TextInput
        style={styles.input}
        placeholder="Описание"
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Сохранить" onPress={handleSave} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: '#f9f9f9' },
});

export default EditNoteScreen;