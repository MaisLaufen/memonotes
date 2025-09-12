import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Folder } from '../../types/models/folder';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/appStack';
import FolderItem from '../../components/FolderItem';
import { useFolderEdit } from '../../hooks/useFolderEdit';
import AddButton from '../../components/AddButton';
import { folderStore } from '../../stores/foldersStore';

type FoldersScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Main'>;

const FoldersScreen = observer(() => {
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
    await folderStore.renameFolder(editingFolderId, editName.trim(), editColor);
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
          onPress: () => folderStore.deleteFolder(folderId)
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
          folderColor: item.color || '#ff0000',
          parentFolderId: null
        });
      }}
    />
  ), [editingFolderId, editName, editColor, handleSaveEdit, cancelEdit, startEdit, handleDeleteFolder]);

  return (
    <View style={styles.container}>      
      <View style={styles.foldersContainer}>
        {folderStore.parentFolders.map((folder) => (
          <View key={folder.id}>
            {renderFolderItem({ item: folder })}
          </View>
        ))}
      </View>
      <AddButton onPress={() => navigation.navigate('CreateFolder')} title='Добавить папку'/>
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
  }
});
export default FoldersScreen;