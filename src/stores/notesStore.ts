import 'react-native-get-random-values';
import { makeAutoObservable } from 'mobx';
import storage from '../services/storage.service';
import { Note } from '../types/models/note';
import { userStore } from './userStore';
import { v4 as uuid } from 'uuid';
import { Folder } from '../types/models/folder';

class NotesStore {
  notes: Note[] = [];
  folders: Folder[] = [];
  isLoading = false;

  constructor() {
    this.isLoading = true;
    makeAutoObservable(this);
    this.loadNotes();
    this.loadFolders();
    this.isLoading = false;
  }

  // ==========================
  // ЗАГРУЗКА
  // ==========================
  async loadNotes() {
    const savedNotes = (await storage.getItem<Note[]>('notes')) || [];
    this.notes = savedNotes;
  }

  async loadFolders() {
    const savedFolders = (await storage.getItem<Folder[]>('folders')) || [];
    this.folders = savedFolders;
  }

  // ==========================
  // ГЕТТЕРЫ
  // ==========================
  get userNotes() {
    if (!userStore.currentUser) return [];
    return this.notes.filter(note => note.owner === userStore.currentUser?.login);
  }

  get userFolders() {
    if (!userStore.currentUser) return [];
    return this.folders.filter(folder => folder.owner === userStore.currentUser?.login);
  }

  getNotesByFolder(folderId: string) {
    return this.userNotes.filter(note => note.folderId === folderId);
  }

  // ==========================
  // ЗАМЕТКИ
  // ==========================
  async addNote(title: string, description: string, folderId?: string) {
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

  // ==========================
  // ПАПКИ
  // ==========================
  async addFolder(name: string) {
    if (!userStore.currentUser) throw new Error('Не авторизован');
    const newFolder: Folder = {
      id: uuid(),
      name,
      owner: userStore.currentUser.login,
      createdAt: Date.now().toString(),
    };
    this.folders.push(newFolder);
    await storage.setItem('folders', this.folders);
  }

  async renameFolder(folderId: string, newName: string) {
    const folder = this.folders.find(f => f.id === folderId);
    if (!folder) return;
    folder.name = newName;
    await storage.setItem('folders', this.folders);
  }

  async deleteFolder(folderId: string) {
    // Удаляем саму папку
    this.folders = this.folders.filter(folder => folder.id !== folderId);

    // Убираем folderId у всех заметок, привязанных к этой папке
    this.notes = this.notes.map(note =>
      note.folderId === folderId ? { ...note, folderId: null } : note
    );

    await storage.setItem('folders', this.folders);
    await storage.setItem('notes', this.notes);
  }

  async clearUserFolders(login: string) {
    this.folders = this.folders.filter(folder => folder.owner !== login);
    await storage.setItem('folders', this.folders);
  }
}

export const notesStore = new NotesStore();