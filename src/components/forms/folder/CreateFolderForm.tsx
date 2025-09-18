import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { folderStore } from '../../../stores/foldersStore';

interface CreateFolderFormProps {
  isVisible: boolean;
  onClose: () => void;
  onAddSuccess?: () => void;
  parentId: string | null; // Обязательный parentId для новой папки
}

const CreateFolderForm: React.FC<CreateFolderFormProps> = ({ 
  isVisible, 
  onClose,
  onAddSuccess,
  parentId
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(folderStore.getFolderColors()[0]);

  const handleCreateFolder = async () => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Введите название папки');
      return;
    }
    
    try {
      await folderStore.addFolder(name.trim(), selectedColor, parentId);
      setName('');
      setSelectedColor(folderStore.getFolderColors()[0]);
      onAddSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать папку');
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Новая папка</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="Название папки"
            value={name}
            onChangeText={setName}
            autoFocus
          />
          
          <Text style={styles.colorLabel}>Цвет папки</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.colorPicker}
            contentContainerStyle={styles.colorPickerContent}
          >
            {folderStore.getFolderColors().map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.addButton, !name.trim() && styles.addButtonDisabled]}
            onPress={handleCreateFolder}
            disabled={!name.trim()}
          >
            <Text style={styles.addButtonText}>Создать</Text>
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
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  colorLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
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
    borderColor: '#333',
    borderWidth: 2,
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

export default CreateFolderForm;