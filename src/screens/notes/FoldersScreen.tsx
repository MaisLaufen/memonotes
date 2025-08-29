import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { notesStore } from '../../stores/notesStore';
import { Folder } from '../../types/models/folder';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/appStack';

type FoldersScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Main'>;

const FOLDER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

const FoldersScreen = observer(() => {
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0]);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const navigation = useNavigation<FoldersScreenNavigationProp>();

  const handleAddFolder = async () => {
    if (!folderName.trim()) return;
    try {
      await notesStore.addFolder(folderName.trim(), selectedColor);
      setFolderName('');
      setSelectedColor(FOLDER_COLORS[0]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать папку');
    }
  };

  const handleStartEdit = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setEditName(folder.name);
    setEditColor(folder.color || FOLDER_COLORS[0]);
  };

  const handleSaveEdit = async () => {
    if (!editingFolderId || !editName.trim()) return;
    await notesStore.renameFolder(editingFolderId, editName.trim(), editColor);
    setEditingFolderId(null);
    setEditName('');
    setEditColor('');
  };

  const handleDeleteFolder = (folderId: string) => {
    Alert.alert(
      'Удаление папки',
      'Вы уверены, что хотите удалить эту папку? Все заметки из этой папки будут перемещены в "Все заметки".',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => notesStore.deleteFolder(folderId)
        }
      ]
    );
  };

  const renderColorPicker = (selected: string, onSelect: (color: string) => void) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
      {FOLDER_COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorOption,
            { backgroundColor: color },
            selected === color && styles.selectedColor
          ]}
          onPress={() => onSelect(color)}
        />
      ))}
    </ScrollView>
  );

  const renderFolderItem = ({ item }: { item: Folder }) => {
    if (editingFolderId === item.id) {
      return (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editName}
            onChangeText={setEditName}
            autoFocus
          />
          {renderColorPicker(editColor, setEditColor)}
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
              <Text style={styles.saveButtonText}>✓ Сохранить</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setEditingFolderId(null)}
            >
              <Text style={styles.cancelButtonText}>✕ Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.folderItem}>
        <TouchableOpacity 
          style={styles.folderInfo}
          onPress={() => {
            navigation.navigate('FolderDetail', {
              folderId: item.id,
              folderName: item.name,
              folderColor: item.color || '#ff0000'
            });
          }}
        >
          <View style={[styles.colorIndicator, { backgroundColor: item.color || '#ff0000' }]} />
          <View style={styles.folderTextContainer}>
            <Text style={styles.folderName}>{item.name}</Text>
            <Text style={styles.noteCount}>
              {notesStore.getNotesByFolder(item.id).length} заметок
            </Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.folderActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleStartEdit(item)}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteFolder(item.id)}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Мои папки</Text>
      
      {/* Форма добавления папки */}
      <View style={styles.addFolderContainer}>
        <TextInput
          style={styles.input}
          placeholder="Название папки"
          value={folderName}
          onChangeText={setFolderName}
        />
        <Text style={styles.colorLabel}>Выберите цвет:</Text>
        {renderColorPicker(selectedColor, setSelectedColor)}
        <TouchableOpacity 
          style={[styles.addButton, !folderName.trim() && styles.addButtonDisabled]}
          onPress={handleAddFolder}
          disabled={!folderName.trim()}
        >
          <Text style={styles.addButtonText}>Добавить папку</Text>
        </TouchableOpacity>
      </View>

      {/* Список папок */}
      {notesStore.userFolders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>У вас пока нет папок</Text>
          <Text style={styles.emptySubtext}>Создайте первую папку для организации ваших заметок</Text>
        </View>
      ) : (
        <FlatList
          data={notesStore.parentFolders}
          keyExtractor={(item) => item.id}
          renderItem={renderFolderItem}
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
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  addFolderContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  folderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  folderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  editInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
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

colorPicker: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
    borderWidth: 2,
  },
  colorLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  folderTextContainer: {
    flex: 1,
  },
  noteCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
});

export default FoldersScreen;