// app/edit/[id].tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Transaction, TransactionType } from '../../lib/models';
import { loadTransactions, saveTransactions } from '../../lib/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../lib/utils';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (id: string) => {
    const all = await loadTransactions();
    const tx = all.find((t) => t.id === id);

    if (!tx) {
      Alert.alert('خطا', 'تراکنش پیدا نشد');
      router.back();
      return;
    }

    setDescription(tx.description);
    setAmount(tx.amount.toString());
    setType(tx.type);
    setDate(new Date(tx.date));
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!description || !amount) {
      Alert.alert('خطا', 'لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    const updatedTransaction: Transaction = {
      id: id!,
      description,
      amount: parseFloat(amount),
      type,
      date: date.toISOString(),
    };

    const all = await loadTransactions();
    const index = all.findIndex((t) => t.id === id);
    if (index === -1) return;

    all[index] = updatedTransaction;
    await saveTransactions(all);

    Alert.alert('موفقیت', 'تراکنش ویرایش شد.');
    router.back();
  };

  if (loading) {
    return <View style={styles.container}><Text>در حال بارگذاری...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ ویرایش تراکنش</Text>

      <Text style={styles.label}>توضیح:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>مبلغ:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>نوع تراکنش:</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === 'income' && styles.selectedButton,
          ]}
          onPress={() => setType('income')}
        >
          <Text
            style={type === 'income' ? styles.selectedText : styles.typeText}
          >
            درآمد
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            type === 'expense' && styles.selectedButton,
          ]}
          onPress={() => setType('expense')}
        >
          <Text
            style={type === 'expense' ? styles.selectedText : styles.typeText}
          >
            هزینه
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>تاریخ تراکنش:</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={[styles.input, { justifyContent: 'center' }]}
      >
        <Text>{formatDate(date.toISOString())}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Button title="ذخیره تغییرات" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { marginTop: 10, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 10,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  typeText: { color: '#333' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
});