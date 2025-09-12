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
    this.isLoading = true;
    makeAutoObservable(this);
    this.loadNotes();
    this.isLoading = false;
  }

  async loadNotes() {
    const savedNotes = (await storage.getItem<Note[]>('notes')) || [];
    this.notes = savedNotes;
  }

  get userNotes() {
    if (!userStore.currentUser) return [];
    return this.notes.filter(note => note.owner === userStore.currentUser?.login);
  }

  getNotesByFolder(folderId: string) {
    return this.userNotes.filter(note => note.folderId === folderId);
  }

  async addNote(title: string, description: string, folderId: string | null) {
    if (!userStore.currentUser) throw new Error('Не авторизован');
    const newNote: Note = {
      id: uuid(),
      title,
      description,
      status: 'new',
      owner: userStore.currentUser.login,
      createdAt: Date.now(),
      folderId: folderId || null,
    };
    this.notes.push(newNote);
    await storage.setItem('notes', this.notes);
    return newNote;
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
    return id;
  }

  async clearUserNotes(login: string) {
    this.notes = this.notes.filter(note => note.owner !== login);
    await storage.setItem('notes', this.notes);
  }
}

export const notesStore = new NotesStore();