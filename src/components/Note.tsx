import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Note } from '../types/models/note';

interface NoteItemProps {
  note: Note;
  color: string;
  onEdit: () => void;
  onDelete: () => void;
}

const NoteItem = observer(({ note, color, onEdit, onDelete }: NoteItemProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onEdit}>
      <View style={[styles.colorIndicator, { backgroundColor: color }]} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {note.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {note.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={(e) => {
              e.stopPropagation();
              onEdit();
            }} style={styles.actionButton}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }} style={styles.actionButton}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 16,
  },
  deleteIcon: {
    fontSize: 16,
  },
});

export default NoteItem;