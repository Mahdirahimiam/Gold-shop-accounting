// app/add.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Transaction, TransactionType } from '../lib/models';
import { loadTransactions, saveTransactions } from '../lib/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../lib/utils';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function AddTransactionScreen() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      console.log('✅ دکمه ثبت کلیک شد');
  
      // 1) بررسی مقدار توضیح و مبلغ
      if (!description.trim()) {
        Alert.alert('خطا', 'فیلد توضیح خالی است.');
        return;
      }
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        Alert.alert('خطا', 'مبلغ باید یک عدد مثبت باشد.');
        return;
      }
  
      // 2) ساخت آبجکت تراکنش
      const newTransaction: Transaction = {
        id: uuidv4(),
        description: description.trim(),
        amount: parsedAmount,
        type,
        date: date.toISOString(),
      };
      console.log('✅ شیء تراکنش قبل از ذخیره:', newTransaction);
  
      // 3) بارگیری و ذخیره
      const existing = await loadTransactions();
      const updated = [newTransaction, ...existing];
      await saveTransactions(updated);
  
      console.log('✅ تراکنش‌ها با موفقیت ذخیره شدند');
      Alert.alert('موفقیت', 'تراکنش ثبت شد.');
      router.back();
    } catch (error) {
      console.error('❌ خطا در ثبت تراکنش:', error);
      Alert.alert('خطا', `ثبت تراکنش با مشکل مواجه شد:\n${error || error}`);
    }
  };  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ ثبت تراکنش جدید</Text>

      <Text style={styles.label}>توضیح:</Text>
      <TextInput
        style={styles.input}
        placeholder="مثلاً: خرید نان"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>مبلغ:</Text>
      <TextInput
        style={styles.input}
        placeholder="مثلاً: 12000"
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

<TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
  <Text style={styles.submitText}>ثبت تراکنش</Text>
</TouchableOpacity>
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
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },  
});