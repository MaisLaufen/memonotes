import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const json = await AsyncStorage.getItem(key);
      return json ? JSON.parse(json) as T : null;
    } catch (error) {
      console.error('Storage get error', error);
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error', error);
    }
  }
};

export default storage;