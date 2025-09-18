import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import NoteItem from '../../../components/Note';
import { notesStore } from '../../../stores/notesStore';
import { Note } from '../../../types/models/note';

interface NotesSectionProps {
  notes: any[];
  onEditNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ 
  notes, 
  onEditNote, 
  onDeleteNote 
}) => {
  if (notes.length === 0) return null;

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Удаление заметки',
      'Вы уверены, что хотите удалить эту заметку?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => notesStore.deleteNote(noteId)
        }
      ]
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Заметки</Text>
      <View style={styles.itemsContainer}>
        {notes.map((note: Note) => (
          <View key={note.id} style={styles.itemWrapper}>
            <NoteItem 
              note={note} 
              color='red'
              onEdit={() => onEditNote(note.id)} 
              onDelete={() => handleDeleteNote(note.id)} 
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
  itemsContainer: {
    paddingHorizontal: 16,
  },
  itemWrapper: {
    marginBottom: 8,
  },
});