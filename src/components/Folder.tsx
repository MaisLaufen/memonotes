import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Folder } from "../types/models/folder";
import React, { useState } from "react";
import FolderItemMenu from "./modals/context-menu/FolderItemMenu";

interface FolderItemProps {
  folder: Folder;
  onEditPress: () => void;
  onDeletePress: () => void;
  onPress: () => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ 
  folder, 
  onEditPress, 
  onDeletePress, 
  onPress 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuPress = (e: any) => {
    e.stopPropagation();
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const onEdit = () => {
    setShowMenu(false);
    onEditPress();
  };

  const onDelete = () => {
    setShowMenu(false);
    onDeletePress();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.folderCard, { backgroundColor: folder.color || '#ff0000' }]}
        onPress={onPress}
      >
        <Text style={styles.folderName}>{folder.name}</Text>
      </TouchableOpacity>
      
      {/* Кнопка меню */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={handleMenuPress}
      >
        <Text style={styles.menuButtonText}>⋯</Text>
      </TouchableOpacity>

      {/* Модальное меню */}
      <FolderItemMenu
        visible={showMenu}
        onClose={handleCloseMenu}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 175,
    marginBottom: 16,
  },
  folderCard: {
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 16,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  menuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  menuButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  }
});

export default FolderItem;