import 'react-native-get-random-values';
import { makeAutoObservable } from 'mobx';
import storage from '../services/storage.service';
import { Note } from '../types/models/note';
import { userStore } from './userStore';
import { v4 as uuid } from 'uuid';

class NotesStore {
  notes: Note[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.loadNotes();
  }

  async loadNotes() {
    this.isLoading = true;
    const savedNotes = (await storage.getItem<Note[]>('notes')) || [];
    this.notes = savedNotes;
    this.isLoading = false;
  }

  get userNotes() {
    if (!userStore.currentUser) return [];
    return this.notes.filter(note => note.owner === userStore.currentUser?.login);
  }

  async addNote(title: string, description: string) {
    console.log("addnote 1");
    if (!userStore.currentUser) throw new Error('Не авторизован');
    const newNote: Note = {
      id: uuid(),
      title,
      description,
      status: 'new',
      owner: userStore.currentUser.login,
      createdAt: Date.now(),
    }
    console.log(newNote);
    console.log('3####', this.notes);
    this.notes.push(newNote);
    console.log('note pushed')
    await storage.setItem('notes', this.notes);
  }

  async updateNote(id: string, updates: Partial<Note>) {
    const index = this.notes.findIndex(note => note.id === id);
    if (index === -1) return;

    this.notes[index] = { ...this.notes[index], ...updates };
    await storage.setItem('notes', this.notes);
  }

  async deleteNote(id: string) {
    this.notes = this.notes.filter(note => note.id !== id);
    await storage.setItem('notes', this.notes);
  }

  async clearUserNotes(login: string) {
    this.notes = this.notes.filter(note => note.owner !== login);
    await storage.setItem('notes', this.notes);
  }
}

export const notesStore = new NotesStore();