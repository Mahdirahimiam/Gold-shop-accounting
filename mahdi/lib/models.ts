// lib/models.ts

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string; // ISO 8601 format (مثلاً: 2025-04-07T10:00:00.000Z)
}