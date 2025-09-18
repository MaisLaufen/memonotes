import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FolderItem from '../../../components/items/Folder';

interface SubFoldersSectionProps {
  subFolders: any[];
  onFolderPress: (folder: any) => void;
  onEditFolder: (folder: any) => void;
  onDeleteFolder: (folderId: string) => void;
}

export const SubFoldersSection: React.FC<SubFoldersSectionProps> = ({ 
  subFolders, 
  onFolderPress,
  onEditFolder,
  onDeleteFolder
}) => {
  if (subFolders.length === 0) return null;

  const handleDeleteFolder = (folderId: string) => {
    // Показываем Alert перед удалением
    // В реальной реализации можно передать callback для Alert
    onDeleteFolder(folderId);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Подпапки</Text>
      <View style={styles.foldersGrid}>
        {subFolders.map(folder => (
          <View key={folder.id} style={styles.folderWrapper}>
            <FolderItem
              folder={folder}
              onEditPress={() => onEditFolder(folder)}
              onDeletePress={() => handleDeleteFolder(folder.id)}
              onPress={() => onFolderPress(folder)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  foldersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  folderWrapper: {
    width: '50%',
    padding: 6,
  },
});