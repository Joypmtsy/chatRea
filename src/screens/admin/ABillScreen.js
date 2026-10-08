import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  ScreenContent,
  FilterBar,
  EmptyState,
  QueryState,
} from "../../components/common/ScreenContent";
import {
  SectionCard,
  PrimaryButton,
  InfoRow,
  StatusBadge,
} from "../../components/common/CommonCp";
import {
  useRestaurantQuery,
  useRestaurantAction,
} from "../../hooks/useRestaurantQuery";
import { appStyles } from "../../styles/appStyles";
import { screenStyles } from "../../styles/screenStyles";
import { baht, tableNumber, displayTime } from "../../utils/format";
import { SummaryCard } from "../../components/admin/AdminCp";
import { BillItem } from "../../components/customer/CustomerCp";
import { billForScreen, settleBill } from "../../db/screenDb";

export default function ABillScreen() {
  const { billId } = useLocalSearchParams();
  const db = useSQLiteContext();
  const query = useRestaurantQuery(
    () => billForScreen(db, billId),
    String(billId),
    true,
  );
  const { run, busy } = useRestaurantAction();
  const [method, setMethod] = useState("cash");
  const bill = query.data;
  const unfinished = bill?.items.some((item) => item.status !== "served");
  const close = () =>
    Alert.alert(
      "ยืนยันรับชำระเงิน",
      "รับเงินครบตามยอดคงเหลือแล้ว และต้องการปิดบิลนี้ใช่ไหม?",
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "รับชำระและปิดบิล",
          onPress: () =>
            run(async () => {
              await settleBill(db, billId, method);
              await query.refresh();
            }),
        },
      ],
    );

  return (
    <ScreenContent
      title={"Bill #" + (billId || "–")}
      rightText={bill ? "โต๊ะ " + tableNumber(bill.tableNumber) : "ผู้ดูแล"}
    >
      <QueryState query={query}>
        {bill && (
          <>
            <View style={screenStyles.wrap}>
              <View style={screenStyles.summary}>
                <SummaryCard
                  title="ยอดรวม"
                  value={baht(bill.total)}
                />
              </View>
              <View style={screenStyles.summary}>
                <SummaryCard
                  title="รอบออเดอร์"
                  value={bill.rounds.length}
                />
              </View>
            </View>
            <SectionCard>
              <InfoRow
                label="โต๊ะ"
                value={tableNumber(bill.tableNumber)}
              />
              <InfoRow
                label="เปิดบิล"
                value={displayTime(bill.opened_at)}
              />
              <InfoRow
                label="ปิดบิล"
                value={displayTime(bill.closed_at)}
              />
              <StatusBadge status={bill.status} />
            </SectionCard>
            {bill.rounds.map((round) => (
              <SectionCard key={round.round_id}>
                <Text style={appStyles.sectionTitle}>
                  Round {round.round_number}
                </Text>
                <Text style={screenStyles.note}>
                  {displayTime(round.created_at)}
                </Text>
                {round.items.map((item) => (
                  <View key={item.order_item_id}>
                    <BillItem
                      item={{
                        name: item.menu_name,
                        quantity: item.quantity,
                        priceAtOrder: item.price_at_order / 100,
                        note: item.note,
                      }}
                    />
                    <StatusBadge status={item.status} />
                  </View>
                ))}
              </SectionCard>
            ))}
            {!bill.items.length && <EmptyState title="ยังไม่มีรายการอาหาร" />}
            <SectionCard>
              <InfoRow
                label="ยอดรวม"
                value={baht(bill.total)}
              />
              <InfoRow
                label="ชำระแล้ว"
                value={baht(bill.paid)}
              />
              <InfoRow
                label="คงเหลือ"
                value={baht(Math.max(0, bill.total - bill.paid))}
              />
            </SectionCard>
            {bill.status === "open" && (
              <>
                <FilterBar
                  options={[
                    {
                      key: "cash",
                      label: "เงินสด",
                    },
                    {
                      key: "qr",
                      label: "QR / โอนเงิน",
                    },
                  ]}
                  value={method}
                  onChange={setMethod}
                />
                {unfinished && (
                  <Text style={screenStyles.note}>
                    ยังมีอาหารที่ไม่เสิร์ฟ ปิดบิลได้เมื่อเสิร์ฟครบแล้ว
                  </Text>
                )}
                <PrimaryButton
                  title="รับชำระและปิดบิล"
                  disabled={busy || unfinished}
                  onPress={close}
                />
                <PrimaryButton
                  title="สั่งอาหารเพิ่ม"
                  disabled={busy}
                  onPress={() =>
                    router.push({
                      pathname: "/customer/menu",
                      params: {
                        billId,
                      },
                    })
                  }
                />
              </>
            )}
          </>
        )}
      </QueryState>
    </ScreenContent>
  );
}
