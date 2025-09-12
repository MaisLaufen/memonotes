// components/AddNoteForm.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet,
  Alert,
  Animated
} from 'react-native';
import { notesStore } from '../../stores/notesStore';

interface AddNoteFormProps {
  isVisible: boolean;
  onClose: () => void;
  onAddSuccess?: () => void;
  folderId?: string | null; // Опционально, для указания папки по умолчанию
  noteId?: string; // Для редактирования
  initialTitle?: string; // Для редактирования
  initialDescription?: string; // Для редактирования
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({ 
  isVisible, 
  onClose,
  onAddSuccess,
  folderId = null,
  noteId,
  initialTitle = '',
  initialDescription = ''
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const isEditing = !!noteId;

  useEffect(() => {
    if (isVisible) {
      setTitle(initialTitle);
      setDescription(initialDescription);
    }
  }, [isVisible, initialTitle, initialDescription]);

  const handleAddNote = async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название заметки');
      return;
    }
    
    try {
      if (isEditing) {
        await notesStore.updateNote(noteId!, { title: title.trim(), description });
      } else {
        await notesStore.addNote(title.trim(), description, folderId);
      }
      setTitle('');
      setDescription('');
      onAddSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert('Ошибка', isEditing ? 'Не удалось обновить заметку' : 'Не удалось добавить заметку');
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{isEditing ? 'Редактировать заметку' : 'Новая заметка'}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="Название заметки"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Описание (необязательно)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.addButton, !title.trim() && styles.addButtonDisabled]}
            onPress={handleAddNote}
            disabled={!title.trim()}
          >
            <Text style={styles.addButtonText}>{isEditing ? 'Сохранить' : 'Добавить'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ... стили остаются те же
const styles = StyleSheet.create({
  // ... (все стили из предыдущего примера)
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 34,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  content: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f3f4',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#5f6368',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4ECDC4',
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
});

export default AddNoteForm;