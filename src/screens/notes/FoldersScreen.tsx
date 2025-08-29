import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { notesStore } from '../../stores/notesStore';
import { Folder } from '../../types/models/folder';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/appStack';
import ColorPicker from '../../components/ColorPicker';
import FolderItem from '../../components/FolderItem';
import { useFolderEdit } from '../../hooks/useFolderEdit';
import { FOLDER_COLORS } from '../../theme/folder_colors';

type FoldersScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Main'>;

const FoldersScreen = observer(() => {
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0]);
  const navigation = useNavigation<FoldersScreenNavigationProp>();
  
  const {
    editingFolderId,
    editName,
    editColor,
    startEdit,
    cancelEdit,
    setEditName,
    setEditColor
  } = useFolderEdit();

  const handleSaveEdit = useCallback(async () => {
    if (!editingFolderId || !editName.trim()) return;
    await notesStore.renameFolder(editingFolderId, editName.trim(), editColor);
    cancelEdit();
  }, [editingFolderId, editName, editColor]);

  const handleDeleteFolder = useCallback((folderId: string) => {
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
  }, []);

  const renderFolderItem = useCallback(({ item }: { item: Folder }) => (
    <FolderItem
      folder={item}
      isEditing={editingFolderId === item.id}
      editName={editName}
      editColor={editColor}
      onEditNameChange={setEditName}
      onEditColorChange={setEditColor}
      onSave={handleSaveEdit}
      onCancel={cancelEdit}
      onEditPress={() => startEdit(item)}
      onDeletePress={() => handleDeleteFolder(item.id)}
      onPress={() => {
        navigation.navigate('FolderDetail', {
          folderId: item.id,
          folderName: item.name,
          folderColor: item.color || '#ff0000'
        });
      }}
    />
  ), [editingFolderId, editName, editColor, handleSaveEdit, cancelEdit, startEdit, handleDeleteFolder]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Мои папки</Text>
      
      <View style={styles.foldersContainer}>
        {notesStore.parentFolders.map((folder) => (
          <View key={folder.id}>
            {renderFolderItem({ item: folder })}
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.addFolderButton}
        onPress={() => navigation.navigate('CreateFolder')}
      >
        <Text style={styles.addFolderButtonText}>+</Text>
        <Text style={styles.addFolderButtonText}>Добавить папку</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  foldersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  addFolderButton: {
    position: 'absolute',
    bottom: 32,
    left: '50%',
    transform: [{ translateX: -75 }],
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFA500',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addFolderButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
export default FoldersScreen;