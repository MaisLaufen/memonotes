import { makeAutoObservable } from 'mobx';
import { v4 as uuid } from 'uuid';
import storage from '../services/storage.service';
import { userStore } from './userStore';
import { Summary } from '../types/models/summary';

class SummariesStore {
  summaries: Summary[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.loadSummaries();
  }

  // ==========================
  // ЗАГРУЗКА
  // ==========================
  async loadSummaries() {
    this.isLoading = true;
    try {
      const savedSummaries = (await storage.getItem<Summary[]>('summaries')) || [];
      this.summaries = savedSummaries;
    } catch (error) {
      console.error('Ошибка загрузки конспектов:', error);
      this.summaries = [];
    } finally {
      this.isLoading = false;
    }
  }

  // ==========================
  // ГЕТТЕРЫ
  // ==========================
  get userSummaries() {
    if (!userStore.currentUser) return [];
    return this.summaries.filter(summary => summary.owner === userStore.currentUser?.login);
  }

  getSummariesByFolder(folderId: string) {
    return this.userSummaries.filter(summary => summary.folderId === folderId);
  }

  getSummaryById(id: string) {
    return this.userSummaries.find(summary => summary.id === id);
  }

  // ==========================
  // КОНСПЕКТЫ
  // ==========================
  async addSummary(title: string, content: string, folderId: string | null) {
    if (!userStore.currentUser) throw new Error('Не авторизован');
    
    const newSummary: Summary = {
      id: uuid(),
      title,
      content,
      folderId: folderId || null,
      owner: userStore.currentUser.login,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    this.summaries.push(newSummary);
    await this.saveToStorage();
    return newSummary;
  }

  async updateSummary(id: string, updates: Partial<Summary>) {
    const index = this.summaries.findIndex(summary => summary.id === id);
    if (index === -1) return null;

    this.summaries[index] = { 
      ...this.summaries[index], 
      ...updates,
      updatedAt: Date.now()
    };
    
    await this.saveToStorage();
    return this.summaries[index];
  }

  async deleteSummary(id: string) {
    this.summaries = this.summaries.filter(summary => summary.id !== id);
    await this.saveToStorage();
  }

  async clearUserSummaries(login: string) {
    this.summaries = this.summaries.filter(summary => summary.owner !== login);
    await this.saveToStorage();
  }

  // ==========================
  // ВСПОМОГАТЕЛЬНЫЕ
  // ==========================
  private async saveToStorage() {
    try {
      await storage.setItem('summaries', this.summaries);
    } catch (error) {
      console.error('Ошибка сохранения конспектов:', error);
    }
  }
}

export const summariesStore = new SummariesStore();