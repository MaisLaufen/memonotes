import { makeAutoObservable } from 'mobx';
import storage from '../services/storage.service';
import { userStore } from './userStore';
import { v4 as uuid } from 'uuid';

export interface Folder {
  id: string;
  name: string;
  color: string;
  owner: string;
  createdAt: string;
  parentId: string | null;
}

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

class FolderStore {
  folders: Folder[] = [];
  isLoading = false;

  constructor() {
    this.isLoading = true;
    makeAutoObservable(this);
    this.loadFolders();
    this.isLoading = false;
  }

  // ==========================
  // ЗАГРУЗКА
  // ==========================
  async loadFolders() {
    const savedFolders = (await storage.getItem<Folder[]>('folders')) || [];
    this.folders = savedFolders;
  }

  // ==========================
  // ГЕТТЕРЫ
  // ==========================
  get userFolders() {
    if (!userStore.currentUser) return [];
    return this.folders.filter(folder => folder.owner === userStore.currentUser?.login);
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
      folder => folder.owner === userStore.currentUser?.login
      && folder.parentId === null
    );
  }

  getFolderById(folderId: string): Folder | undefined {
    return this.folders.find(folder => folder.id === folderId);
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
    return newFolder;
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
    await storage.setItem('folders', this.folders);
    return folderId;
  }

  async clearUserFolders(login: string) {
    this.folders = this.folders.filter(folder => folder.owner !== login);
    await storage.setItem('folders', this.folders);
  }

  // ==========================
  // УТИЛИТЫ
  // ==========================
  getRandomColor(): string {
    return FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)];
  }

  getFolderColors(): string[] {
    return [...FOLDER_COLORS];
  }
}

export const folderStore = new FolderStore();