import 'react-native-get-random-values';
import { makeAutoObservable } from 'mobx';
import storage from '../services/storage.service';
import { Note } from '../types/models/note';
import { userStore } from './userStore';
import { v4 as uuid } from 'uuid';
import { Folder } from '../types/models/folder';

const FOLDER_COLORS = [
  '#FF6B6B', // красный
  '#4ECDC4', // бирюзовый
  '#45B7D1', // синий
  '#96CEB4', // зеленый
  '#FFEAA7', // желтый
  '#DDA0DD', // фиолетовый
  '#98D8C8', // мятный
  '#F7DC6F', // золотой
  '#BB8FCE', // лиловый
  '#85C1E9', // голубой
];

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

  getSubFolders(parentFolderId: string) {
    if (!userStore.currentUser) return [];
    return this.folders.filter(folder => 
      folder.owner === userStore.currentUser?.login && 
      folder.parentId === parentFolderId
    );
  }

  get parentFolders() {
    if (!userStore.currentUser) return [];
    return this.folders.filter(
      folder => folder.owner == userStore.currentUser?.login
      && folder.parentId == null);
  }

  // ==========================
  // ЗАМЕТКИ
  // ==========================
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

  
  async addFolder(name: string, color?: string, parentId?: string | null) {
    if (!userStore.currentUser) throw new Error('Не авторизован');
    
    const newFolder: Folder = {
      id: uuid(),
      name,
      color: color || FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)],
      owner: userStore.currentUser.login,
      createdAt: Date.now().toString(),
      parentId: parentId || null,
    };
    this.folders.push(newFolder);
    await storage.setItem('folders', this.folders);
  }

  async renameFolder(folderId: string, newName: string, newColor?: string, newParentId?: string | null) {
    const folder = this.folders.find(f => f.id === folderId);
    if (!folder) return;
    folder.name = newName;
    if (newColor) {
      folder.color = newColor;
    }
    if (newParentId !== undefined) {
      folder.parentId = newParentId;
    }
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