import React from "react";
import { Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  ScreenContent,
  EmptyState,
  QueryState,
} from "../../components/common/ScreenContent";
import {
  SectionCard,
  PrimaryButton,
  InfoRow,
} from "../../components/common/CommonCp";
import {
  useRestaurantQuery,
  useRestaurantAction,
} from "../../hooks/useRestaurantQuery";
import { appStyles } from "../../styles/appStyles";
import { screenStyles } from "../../styles/screenStyles";
import { baht } from "../../utils/format";
import { CartItem } from "../../components/customer/CustomerCp";
import { CustomerNavigation } from "../../components/customer/CustomerNavigation";
import { useCart } from "../../context/CartContext";
import { submitOrder, billForScreen } from "../../db/screenDb";
export function CartContent({
  cart = [],
  onIncrease,
  onDecrease,
  onClear,
  onSubmit,
  note = "",
  onNoteChange,
  onItemNoteChange,
  submitting = false,
  closed = false,
}) {
  const total = cart.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.qty,
    0,
  );

  return (
    <SectionCard>
      <Text style={appStyles.sectionTitle}>ตะกร้าอาหาร</Text>
      {cart.length ? (
        cart.map((item) => (
          <View key={item.id}>
            <CartItem
              item={item}
              disabled={submitting || closed}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
            />
            <TextInput
              style={appStyles.input}
              value={item.note || ""}
              onChangeText={(value) => onItemNoteChange(item.id, value)}
              editable={!submitting && !closed}
              placeholder={"หมายเหตุสำหรับ " + item.name}
            />
          </View>
        ))
      ) : (
        <EmptyState title="ตะกร้ายังว่าง" />
      )}
      <TextInput
        style={[appStyles.input, screenStyles.input]}
        value={note}
        onChangeText={onNoteChange}
        editable={!submitting && !closed}
        placeholder="หมายเหตุ เช่น เผ็ดน้อย"
        multiline
      />
      <InfoRow
        label="ยอดรวมโดยประมาณ"
        value={baht(total)}
      />
      <Text style={screenStyles.note}>
        ระบบใช้ราคาปัจจุบัน ณ เวลาส่งออเดอร์
      </Text>
      <PrimaryButton
        title={submitting ? "กำลังส่ง…" : "ส่งออเดอร์"}
        disabled={!cart.length || submitting || closed}
        onPress={onSubmit}
        style={appStyles.marginTopMd}
      />
      <PrimaryButton
        title="ล้างตะกร้า"
        disabled={!cart.length || submitting}
        onPress={onClear}
        style={appStyles.marginTopMd}
      />
    </SectionCard>
  );
}

export default function CartScreen() {
  const { billId } = useLocalSearchParams();
  const db = useSQLiteContext();
  const cart = useCart(String(billId));
  const { run, busy } = useRestaurantAction();
  const query = useRestaurantQuery(
    () => billForScreen(db, billId),
    String(billId),
    true,
  );
  const submit = () =>
    run(async () => {
      await submitOrder(
        db,
        billId,
        cart.items.map((item) => ({
          menuId: item.id,
          quantity: item.qty,
          note: item.note || cart.note,
        })),
      );
      cart.clear();
      router.replace({
        pathname: "/customer/orders",
        params: {
          billId,
        },
      });
    });

  return (
    <ScreenContent title="ตะกร้าอาหาร">
      <CustomerNavigation billId={billId} />
      <QueryState query={query}>
        {query.data?.status !== "open" && (
          <Text style={screenStyles.note}>
            บิลนี้ปิดแล้ว ไม่สามารถส่งออเดอร์เพิ่มได้
          </Text>
        )}
        <CartContent
          cart={cart.items}
          onIncrease={cart.add}
          onDecrease={cart.decrease}
          onClear={cart.clear}
          onSubmit={submit}
          note={cart.note}
          onNoteChange={cart.setNote}
          onItemNoteChange={cart.setItemNote}
          submitting={busy}
          closed={query.data?.status !== "open"}
        />
      </QueryState>
    </ScreenContent>
  );
}
