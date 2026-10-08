import React, { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { CartProvider } from "../context/CartContext";
import { initializeRestaurant } from "../db/screenDb";
import { DATABASE_NAME } from "../db/restaurantDb";
import { appStyles } from "../styles/appStyles";
import { colors } from "../styles/theme";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  return (
    <Suspense
      fallback={
        <View style={appStyles.emptyContainer}>
          <ActivityIndicator size="large" />
        </View>
      }
    >
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        onInit={initializeRestaurant}
        useSuspense
      >
        <CartProvider>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.primaryDark },
              headerTintColor: colors.textWhite,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen
              name="index"
              options={{ title: "HONEY RESTAURANT" }}
            />
            <Stack.Screen
              name="customer/tables"
              options={{ title: "เลือกโต๊ะ" }}
            />
            <Stack.Screen
              name="customer/menu"
              options={{ title: "เมนูอาหาร" }}
            />
            <Stack.Screen
              name="customer/cart"
              options={{ title: "ตะกร้าอาหาร" }}
            />
            <Stack.Screen
              name="customer/orders"
              options={{ title: "สถานะออเดอร์" }}
            />
            <Stack.Screen
              name="customer/bill"
              options={{ title: "บิลของฉัน" }}
            />
            <Stack.Screen
              name="kitchen/queue"
              options={{ title: "คิวครัว" }}
            />
            <Stack.Screen
              name="kitchen/detail"
              options={{ title: "รายละเอียดรอบออเดอร์" }}
            />
            <Stack.Screen
              name="admin/dashboard"
              options={{ title: "แดชบอร์ด" }}
            />
            <Stack.Screen
              name="admin/tables"
              options={{ title: "จัดการโต๊ะ" }}
            />
            <Stack.Screen
              name="admin/menus"
              options={{ title: "จัดการเมนู" }}
            />
            <Stack.Screen
              name="admin/bill"
              options={{ title: "รายละเอียดบิล" }}
            />
            <Stack.Screen
              name="admin/history"
              options={{ title: "ประวัติบิล" }}
            />
            <Stack.Screen
              name="admin/report"
              options={{ title: "รายงานยอดขาย" }}
            />
            <Stack.Screen
              name="admin/reset"
              options={{ title: "ล้างรายการขาย" }}
            />
          </Stack>
        </CartProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
