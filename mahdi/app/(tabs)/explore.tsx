// app/(tabs)/explore.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Transaction } from '../../lib/models';
import { loadTransactions } from '../../lib/storage';
import { formatDate } from '../../lib/utils';

export default function ExploreScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await loadTransactions();
        setTransactions(data);
      };
      fetchData();
    }, [])
  );

  const filtered = transactions.filter((t) => {
    const matchesQuery =
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.amount.toString().includes(query);

    const matchesType = typeFilter === 'all' || t.type === typeFilter;

    return matchesQuery && matchesType;
  });

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/edit/${item.id}`)}
    >
      <View>
        <Text style={styles.desc}>{item.description}</Text>
        <Text>{formatDate(item.date)}</Text>
        <Text style={{ color: item.type === 'income' ? 'green' : 'red' }}>
          {item.type === 'income' ? '+' : '-'}
          {item.amount.toLocaleString()} تومان
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 جستجوی تراکنش‌ها</Text>

      <TextInput
        style={styles.input}
        placeholder="جستجو (مثلاً خرید، 10000)"
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.filterRow}>
        {['all', 'income', 'expense'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setTypeFilter(type as any)}
            style={[
              styles.filterButton,
              typeFilter === type && styles.activeFilterButton,
            ]}
          >
            <Text
              style={
                typeFilter === type ? styles.activeFilterText : styles.filterText
              }
            >
              {type === 'all' ? 'همه' : type === 'income' ? 'درآمد' : 'هزینه'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <Text style={styles.empty}>تراکنشی یافت نشد.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  item: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  desc: { fontWeight: 'bold', marginBottom: 5 },
  empty: {
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 10,
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
  filterText: { color: '#333' },
  activeFilterText: { color: '#fff', fontWeight: 'bold' },
});
