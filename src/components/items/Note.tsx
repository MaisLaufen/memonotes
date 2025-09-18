import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { folderStore } from '../../stores/foldersStore';
import NoteItemMenu from '../modals/context-menu/NoteItemMenu';

interface NoteItemProps {
  note: any;
  color: string;
  onEdit: () => void;
  onDelete: () => void;
}

const NoteItem = ({ note, color, onEdit, onDelete }: NoteItemProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

  const folderPath = useMemo(() => {
    if (!note.folderId) return "";
    const path: string[] = [];
    let currentFolderId = note.folderId;
    while (currentFolderId) {
      const folder = folderStore.folders.find((f) => f.id === currentFolderId);
      if (!folder) break;
      path.unshift(folder.name);
      currentFolderId = folder.parentId;
    }
    return path.join(" › ");
  }, [note.folderId, folderStore.folders]);

  return (
    <View style={{...styles.container, borderColor: color, borderWidth: 2}}>
      <View style={styles.header}>
        <Text style={styles.title}>{note.title}</Text>
        <TouchableOpacity onPress={() => setShowMenu(true)}>
                  <Text style={styles.menuButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{note.description}</Text>

      <View style={styles.footer}>
        {folderPath ? (
          <View style={styles.folderPathContainer}>
            <Text style={[styles.folderPath, {color: color}]} numberOfLines={1}>
              {folderPath}
            </Text>
          </View>
        ) : (
          <View />
        )}
        <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
      </View>

      <NoteItemMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    marginBottom: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  folderPathContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  folderPath: {
    fontSize: 12,
    color: "#888",
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  menuButtonText: {
    fontSize: 20,
    //color: '#fff',
    fontWeight: 'bold',
    color: "#666",
  },

});

export default NoteItem;