import { makeAutoObservable } from 'mobx';
import storage from '../services/storage.service';
import { User } from '../interfaces/user';

class UserStore {
  currentUser: User | null = null;
  isLoading = true;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  async init() {
    const savedUser = await storage.getItem<User>('currentUser');
    this.currentUser = savedUser || null;
    this.isLoading = false;
  }

  async login(login: string, password: string) {
    const savedUsers = (await storage.getItem<User[]>('users')) || [];
    const foundUser = savedUsers.find(
      u => u.login === login && u.password === password
    );

    if (!foundUser) return false;

    this.currentUser = foundUser;
    await storage.setItem('currentUser', foundUser);
    return true;
  }

  async register(username: string, login: string, password: string) {
    const savedUsers = (await storage.getItem<User[]>('users')) || [];
    if (savedUsers.find(u => u.login === login)) return false;

    const newUser: User = { username, login, password };
    savedUsers.push(newUser);

    await storage.setItem('users', savedUsers);
    await storage.setItem('currentUser', newUser);
    this.currentUser = newUser;

    return true;
  }

  async logout() {
    this.currentUser = null;
    await storage.removeItem('currentUser');
  }

  get isLoggedIn() {
    return this.currentUser !== null;
  }
}

export const userStore = new UserStore();