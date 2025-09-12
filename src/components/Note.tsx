import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { folderStore } from '../stores/foldersStore';
import NoteItemMenu from './modals/context-menu/NoteItemMenu';

interface NoteItemProps {
  note: any;
  color: string;
  onEdit: () => void;
  onDelete: () => void;
}

const NoteItem = ({ note, color, onEdit, onDelete }: NoteItemProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const getFolderPath = () => {
    if (!note.folderId) return '';
    
    const path: string[] = [];
    let currentFolderId = note.folderId;
    
    // Собираем путь от текущей папки к корню
    while (currentFolderId) {
      const folder = folderStore.folders.find(f => f.id === currentFolderId);
      if (!folder) break;
      
      path.unshift(folder.name); // Добавляем в начало массива
      currentFolderId = folder.parentId;
    }
    
    return path.join(' / ');
  };

  const handleMenuPress = (e: any) => {
    e.stopPropagation();
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const folderPath = getFolderPath();

  return (
    <View style={styles.container}>
      <View style={[styles.colorIndicator, { backgroundColor: color }]} />
      <View style={styles.content}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.description}>{note.description}</Text>
        
        <View style={styles.footer}>
          {folderPath ? (
            <View style={styles.folderPathContainer}>
              <View style={[styles.folderPathColor, { backgroundColor: color }]} />
              <Text style={styles.folderPath} numberOfLines={1}>
                {folderPath}
              </Text>
            </View>
          ) : (
            <View />
          )}
          
          <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
        </View>
      </View>
      
      {/* Кнопка меню */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={handleMenuPress}
      >
        <Text style={styles.menuButtonText}>⋯</Text>
      </TouchableOpacity>

      {/* Модальное меню */}
      <NoteItemMenu
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
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    position: 'relative',
  },
  colorIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  folderPathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  folderPathColor: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  folderPath: {
    fontSize: 11,
    color: '#888',
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  menuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  menuButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NoteItem;