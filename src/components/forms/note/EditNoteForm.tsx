import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet,
  Alert
} from 'react-native';
import { notesStore } from '../../../stores/notesStore';
import LinearGradient from 'react-native-linear-gradient';

interface EditNoteFormProps {
  isVisible: boolean;
  onClose: () => void;
  onEditSuccess?: () => void;
  noteId: string;
  initialTitle: string;
  initialDescription: string;
}

const EditNoteForm: React.FC<EditNoteFormProps> = ({ 
  isVisible, 
  onClose,
  onEditSuccess,
  noteId,
  initialTitle,
  initialDescription
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    if (isVisible) {
      setTitle(initialTitle);
      setDescription(initialDescription);
    }
  }, [isVisible, initialTitle, initialDescription]);

  const handleEditNote = async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название заметки');
      return;
    }
    
    try {
      await notesStore.updateNote(noteId, { title: title.trim(), description });
      onEditSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить заметку');
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View>
        <LinearGradient
          colors={['transparent', '#8e44ff']}
          style={styles.glow}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Редактировать заметку</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <TextInput
              style={styles.input}
              placeholder="Введите название заметки..."
              placeholderTextColor={'#656565ff'}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Описание (необязательно)..."
              placeholderTextColor={'#656565ff'}
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
              onPress={handleEditNote}
              disabled={!title.trim()}
            >
              <Text style={styles.addButtonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 34,
    width: '100%',
    borderTopWidth: 1,
    borderColor: 'rgba(143, 68, 255)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f5f5f5',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#aaa',
    fontWeight: '300',
  },
  content: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(142, 68, 255, 0.4)',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
  },
  colorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ddd',
    marginBottom: 16,
  },
  colorPicker: {
    marginBottom: 8,
  },
  colorPickerContent: {
    paddingVertical: 8,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#8e44ff',
    borderWidth: 3,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#bbb',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#8e44ff',
  },
  addButtonDisabled: {
    backgroundColor: '#5e5e5e',
  },
  addButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  glow: {
    position: 'absolute',
    top: -90,    // чтобы "выходило" за пределы контейнера
    left: 0,
    right: 0,
    height: 120,  // высота свечения
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});

export default EditNoteForm;