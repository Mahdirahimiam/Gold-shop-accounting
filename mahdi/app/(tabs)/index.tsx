// app/(tabs)/index.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { Transaction, TransactionType } from '../../lib/models';
import {
  loadTransactions,
  saveTransactions,
  exportTransactions,
} from '../../lib/storage';
import { formatDate } from '../../lib/utils';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function DashboardScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterDate, setFilterDate] = useState<'all' | 'today'>('all');

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const data = await loadTransactions();
        setTransactions(data);
      };
  
      loadData();
    }, [])
  );

  const loadData = async () => {
    const data = await loadTransactions();
    setTransactions(data);
  };

  const handleDelete = (id: string) => {
    Alert.alert('حذف تراکنش', 'آیا مطمئن هستید؟', [
      { text: 'لغو', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          const newList = transactions.filter((t) => t.id !== id);
          setTransactions(newList);
          await saveTransactions(newList);
        },
      },
    ]);
  };

  const filteredTransactions = transactions.filter((t) => {
    const now = new Date();
    const tDate = new Date(t.date);

    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesDate =
      filterDate === 'all' ||
      (tDate.getFullYear() === now.getFullYear() &&
        tDate.getMonth() === now.getMonth() &&
        tDate.getDate() === now.getDate());

    return matchesType && matchesDate;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 داشبورد مالی</Text>

      {/* خلاصه مالی */}
      <View style={styles.summaryBox}>
        <Text style={styles.income}>درآمد: {totalIncome.toLocaleString()} تومان</Text>
        <Text style={styles.expense}>هزینه: {totalExpense.toLocaleString()} تومان</Text>
        <Text style={styles.balance}>موجودی: {balance.toLocaleString()} تومان</Text>
      </View>

      {/* فیلتر نوع */}
      <View style={styles.filterRow}>
        {['all', 'income', 'expense'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilterType(type as any)}
            style={[
              styles.filterButton,
              filterType === type && styles.activeFilterButton,
            ]}
          >
            <Text
              style={
                filterType === type
                  ? styles.activeFilterText
                  : styles.filterText
              }
            >
              {type === 'all'
                ? 'همه'
                : type === 'income'
                ? 'درآمد'
                : 'هزینه'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* فیلتر تاریخ */}
      <View style={styles.filterRow}>
        {['all', 'today'].map((dateFilter) => (
          <TouchableOpacity
            key={dateFilter}
            onPress={() => setFilterDate(dateFilter as any)}
            style={[
              styles.filterButton,
              filterDate === dateFilter && styles.activeFilterButton,
            ]}
          >
            <Text
              style={
                filterDate === dateFilter
                  ? styles.activeFilterText
                  : styles.filterText
              }
            >
              {dateFilter === 'all' ? 'همه روزها' : 'امروز'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* دکمه افزودن تراکنش */}
      <Link href="/add" style={styles.addButton}>
        <Text style={styles.addButtonText}>➕ افزودن تراکنش جدید</Text>
      </Link>

      {/* دکمه Export */}
      <TouchableOpacity
        onPress={() => exportTransactions(transactions)}
        style={[styles.addButton, { backgroundColor: '#2196F3' }]}
      >
        <Text style={styles.addButtonText}>📤 خروجی گرفتن (Export)</Text>
      </TouchableOpacity>

      {/* لیست تراکنش‌ها */}
      <Text style={styles.subTitle}>📃 لیست تراکنش‌ها:</Text>
      {filteredTransactions.length === 0 ? (
        <Text style={styles.empty}>تراکنشی برای نمایش وجود ندارد.</Text>
      ) : (
        <FlatList
          data={filteredTransactions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.transactionText}>{item.description}</Text>
                <Text>{formatDate(item.date)}</Text>
                <Text
                  style={{
                    color: item.type === 'income' ? 'green' : 'red',
                  }}
                >
                  {item.type === 'income' ? '+' : '-'}
                  {item.amount.toLocaleString()} تومان
                </Text>
              </View>

              <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                <Link href={`/edit/${item.id}`} style={{ marginBottom: 5 }}>
                  <Text style={{ color: 'blue', fontSize: 12 }}>ویرایش</Text>
                </Link>

                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={{ color: 'red', fontSize: 12 }}>حذف</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  income: {
    color: 'green',
    fontSize: 16,
    marginBottom: 5,
  },
  expense: {
    color: 'red',
    fontSize: 16,
    marginBottom: 5,
  },
  balance: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  empty: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  transactionItem: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionText: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 4,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterText: {
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
