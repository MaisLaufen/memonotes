import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Note } from '../types/models/note';


interface NoteItemProps {
  note: Note;
  color: string;
  onEdit(noteId: string): void;
  onDelete(noteId: string): void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, color, onEdit, onDelete }) => {

  return (
    <View style={[styles.note, { backgroundColor: color }]}>
      <Text style={styles.title}>{note.title}</Text>
      <Text>{note.description}</Text>
      <Text style={styles.status}>
        Статус: {note.status} | Дата: {new Date(note.createdAt).toLocaleDateString()}
      </Text>

      <View style={styles.actions}>
        <Button
          title="Редактировать"
          onPress={() => onEdit(note.id)}
        />
        <Button
          title="Удалить"
          color="red"
          onPress={() => onDelete(note.id)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  note: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  title: { fontWeight: 'bold', fontSize: 16, color: '#fff' },
  status: { fontStyle: 'italic', marginTop: 5, color: '#ddd' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});

export default NoteItem;