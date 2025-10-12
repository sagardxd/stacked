import { KeyType } from '@/types/keys.types';
import * as SecureStore from 'expo-secure-store';

export async function saveToSecureStore(key: KeyType, value: string) {
    console.log('saving secure token', value);
    await SecureStore.setItemAsync(key, value);
}

export async function getFromSecureStore(key: KeyType): Promise<string | null> {
    const storedValue = await SecureStore.getItemAsync(key);
    return storedValue;
}

export async function removeFromSecureStore(key: KeyType): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log('remove from secure store');
    return true;
  } catch (error) {
    console.error("Error removing item from SecureStore:", error);
    return false;
  }
}
