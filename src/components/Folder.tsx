import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Folder } from "../types/models/folder";
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import ColorPicker from "./ColorPicker";
import { notesStore } from "../stores/notesStore";

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

  const handleMenuPress = () => {
    setShowMenu(true);
  };

  const handleEditPress = () => {
    setShowMenu(false);
    onEditPress();
  };

  const handleDeletePress = () => {
    setShowMenu(false);
    onDeletePress();
  };

  const noteCount = notesStore.getNotesByFolder(folder.id).length;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.folderCard, { backgroundColor: folder.color || '#ff0000' }]}
        onPress={onPress}
      >
        <Text style={styles.folderName}>{folder.name}</Text>
        <Text style={styles.noteCount}>
          {noteCount} заметок
        </Text>
      </TouchableOpacity>
      
      {/* Кнопка меню */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={handleMenuPress}
      >
        <Text style={styles.menuButtonText}>⋯</Text>
      </TouchableOpacity>

      {/* Модальное меню */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowMenu(false)}
        >
          <View style={[styles.menuContainer, { backgroundColor: 'white' }]}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleEditPress}
            >
              <Text style={styles.menuItemText}>✏️ Редактировать</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleDeletePress}
            >
              <Text style={styles.menuItemText}>🗑️ Удалить</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  noteCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 180,
  },
  menuItem: {
    padding: 12,
    borderRadius: 4,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default FolderItem;