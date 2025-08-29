import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Folder } from "../types/models/folder";
import React from "react";
import { observer } from "mobx-react-lite";
import ColorPicker from "./ColorPicker";
import { notesStore } from "../stores/notesStore";

interface FolderItemProps {
  folder: Folder;
  isEditing: boolean;
  editName: string;
  editColor: string;
  onEditNameChange: (text: string) => void;
  onEditColorChange: (color: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEditPress: () => void;
  onDeletePress: () => void;
  onPress: () => void;
}

const FolderItem = observer(({ 
  folder, 
  isEditing, 
  editName, 
  editColor, 
  onEditNameChange, 
  onEditColorChange, 
  onSave, 
  onCancel, 
  onEditPress, 
  onDeletePress,
  onPress
}: FolderItemProps) => {
  return (
    <TouchableOpacity 
      style={[styles.folderCard, { backgroundColor: folder.color || '#ff0000' }]}
      onPress={onPress}
    >
      <Text style={styles.folderName}>{folder.name}</Text>
      <Text style={styles.noteCount}>
        {notesStore.getNotesByFolder(folder.id).length} заметок
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  folderCard: {
    width: 175, // TODO: исправить
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 16,
    // Убираем лишние отступы внутри
  },
  folderIcon: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 8,
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
});

export default FolderItem;