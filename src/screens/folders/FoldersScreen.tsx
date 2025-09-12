import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/appStack';
import FolderItem from '../../components/Folder';
import AddButton from '../../components/AddButton';
import { folderStore } from '../../stores/foldersStore';
import AddFolderForm from '../../components/forms/AddFolderForm';

type FoldersScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Main'>;

const FoldersScreen = observer(() => {
  const navigation = useNavigation<FoldersScreenNavigationProp>();
  const [showAddFolderForm, setShowAddFolderForm] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [formFolderData, setFormFolderData] = useState<{id: string, name: string, color: string} | null>(null);

  const handleDeleteFolder = (folderId: string, folderName: string) => {
    Alert.alert(
      'Удаление папки',
      `Вы уверены, что хотите удалить папку ${folderName}? Все заметки из этой папки будут перемещены в "Все заметки".`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => folderStore.deleteFolder(folderId)
        }
      ]
    );
  };

  const handleEditFolder = (folder: any) => {
    setShowAddFolderForm(false);
    setFormFolderData({
      id: folder.id,
      name: folder.name,
      color: folder.color
    });
    setTimeout(() => {
      setFormKey(prev => prev + 1);
      setShowAddFolderForm(true);
    }, 0);
  };

  const handleShowAddForm = () => {
    setShowAddFolderForm(false);
    setFormFolderData(null);
    setTimeout(() => {
      setFormKey(prev => prev + 1);
      setShowAddFolderForm(true);
    }, 0);
  };

  const handleCloseForm = () => {
    setShowAddFolderForm(false);
    setFormFolderData(null);
  };

  const handleAddFolderSuccess = () => {
    setFormFolderData(null);
  };

  const renderFolderItem = ({ item }: { item: any }) => (
    <FolderItem
      folder={item}
      onEditPress={() => handleEditFolder(item)}
      onDeletePress={() => handleDeleteFolder(item.id, item.title)}
      onPress={() => {
        navigation.navigate('FolderDetail', {
          folderId: item.id,
          folderName: item.name,
          folderColor: item.color || '#ff0000',
          parentFolderId: null
        });
      } }/>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.foldersContainer}>
        {folderStore.parentFolders.map((folder) => (
          <View key={folder.id} style={styles.folderItemWrapper}>
            {renderFolderItem({ item: folder })}
          </View>
        ))}
      </ScrollView>
      
      <AddButton onPress={handleShowAddForm} title='Добавить папку'/>

      {showAddFolderForm && (
        <AddFolderForm
          key={formKey}
          isVisible={showAddFolderForm}
          onClose={handleCloseForm}
          onAddSuccess={handleAddFolderSuccess}
          folderId={formFolderData?.id}
          initialName={formFolderData?.name || ''}
          initialColor={formFolderData?.color || ''}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  foldersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  folderItemWrapper: {
    width: 175,
  },
});

export default FoldersScreen;