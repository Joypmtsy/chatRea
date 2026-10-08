import React, { useState } from "react";
import { TextInput } from "react-native";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  ScreenContent,
  EmptyState,
  QueryState,
} from "../../components/common/ScreenContent";
import { useRestaurantQuery } from "../../hooks/useRestaurantQuery";
import { appStyles } from "../../styles/appStyles";
import { tableNumber, today, dateRange, displayTime } from "../../utils/format";
import { BillRow } from "../../components/admin/AdminCp";
import { reportForScreen } from "../../db/screenDb";

export default function BillHistoryScreen() {
  const db = useSQLiteContext();
  const [day, setDay] = useState(today());
  const [search, setSearch] = useState("");
  const query = useRestaurantQuery(
    () => reportForScreen(db, ...dateRange(day)),
    day,
  );
  const bills =
    query.data?.bills.filter(
      (bill) =>
        String(bill.bill_id).includes(search.trim()) ||
        tableNumber(bill.table_number).includes(search.trim()),
    ) || [];

  return (
    <ScreenContent
      title="ประวัติบิล"
      rightText="ผู้ดูแล"
    >
      <TextInput
        style={appStyles.input}
        value={day}
        onChangeText={setDay}
        placeholder="วันที่ YYYY-MM-DD"
        autoCapitalize="none"
      />
      <TextInput
        style={appStyles.input}
        value={search}
        onChangeText={setSearch}
        placeholder="ค้นหาเลขบิล / โต๊ะ"
      />
      <QueryState query={query}>
        {bills.map((bill) => (
          <BillRow
            key={bill.bill_id}
            billId={bill.bill_id}
            tableNumber={tableNumber(bill.table_number)}
            openedAt={displayTime(bill.opened_at)}
            closedAt={displayTime(bill.closed_at)}
            total={bill.total / 100}
            onPress={() =>
              router.push({
                pathname: "/admin/bill",
                params: {
                  billId: bill.bill_id,
                },
              })
            }
          />
        ))}
        {!bills.length && <EmptyState title="ไม่มีบิลที่ปิดในวันที่เลือก" />}
      </QueryState>
    </ScreenContent>
  );
}
