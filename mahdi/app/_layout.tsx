// app/_layout.tsx

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        {/* تب‌های اصلی اپ (Dashboard و ...) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* صفحه افزودن تراکنش */}
        <Stack.Screen
          name="add"
          options={{
            title: 'افزودن تراکنش',
            presentation: 'modal', // نمایش به صورت مودال
          }}
        />

        {/* صفحه ویرایش تراکنش */}
        <Stack.Screen
          name="edit/[id]"
          options={{
            title: 'ویرایش تراکنش',
            presentation: 'modal', // مودال یا default
          }}
        />

        {/* صفحه تنظیمات (در صورت وجود) */}
        <Stack.Screen
          name="settings"
          options={{
            title: 'تنظیمات',
          }}
        />
      </Stack>
    </>
  );
}