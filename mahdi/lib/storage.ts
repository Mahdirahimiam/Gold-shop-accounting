// lib/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Transaction } from './models';

const STORAGE_KEY = 'transactions';

export const saveTransactions = async (transactions: Transaction[]) => {
  try {
    const json = JSON.stringify(transactions);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('خطا در ذخیره‌سازی تراکنش‌ها:', error);
  }
};

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('خطا در بارگذاری تراکنش‌ها:', error);
    return [];
  }
};

export const exportTransactions = async (transactions: Transaction[]) => {
  try {
    const content = JSON.stringify(transactions, null, 2);
    const fileUri = FileSystem.documentDirectory + 'transactions-backup.json';

    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: '📤 اشتراک‌گذاری فایل تراکنش‌ها',
    });
  } catch (error) {
    console.error('خطا در خروجی گرفتن از تراکنش‌ها:', error);
  }
};