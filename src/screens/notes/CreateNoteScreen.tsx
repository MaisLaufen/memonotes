import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { notesStore } from '../../stores/notesStore';
import { AppStackParamList } from '../../navigation/appStack';

type CreateNoteScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'CreateNote'>;

const CreateNoteScreen = observer(() => {
  const navigation = useNavigation<CreateNoteScreenNavigationProp>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const handleCreateNote = async () => {
    if (!title.trim()) return;
    
    try {
      await notesStore.addNote(title, description, selectedFolder);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать заметку');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Новая заметка</Text>
        <TouchableOpacity 
          onPress={handleCreateNote}
          style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
          disabled={!title.trim()}
        >
          <Text style={styles.saveText}>Готово</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          style={styles.titleInput}
          placeholder="Заголовок"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />
        <TextInput
          style={styles.descriptionInput}
          placeholder="Текст заметки..."
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 20,
    color: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 16,
    color: '#8A2BE2',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  descriptionInput: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 200,
    textAlignVertical: 'top',
  },
});

export default CreateNoteScreen;