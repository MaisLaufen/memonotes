import { makeAutoObservable } from 'mobx';
import storage from '../services/storage.service';
import { userStore } from './userStore';
import { v4 as uuid } from 'uuid';
import { Folder } from '../types/models/folder';
import { FOLDER_COLORS } from '../theme/folder_colors';

class FolderStore {
  folders: Folder[] = [];
  isLoading = false;

  constructor() {
    this.isLoading = true;
    makeAutoObservable(this);
    this.loadFolders();
    this.isLoading = false;
  }

  async loadFolders() {
    const savedFolders = (await storage.getItem<Folder[]>('folders')) || [];
    this.folders = savedFolders;
  }

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

  getRandomColor(): string {
    return FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)];
  }

  getFolderColors(): string[] {
    return [...FOLDER_COLORS];
  }
}

export const folderStore = new FolderStore();