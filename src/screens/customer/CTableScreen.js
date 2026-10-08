import React, { useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  ScreenContent,
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
import { screenStyles } from "../../styles/screenStyles";
import { CustomerTableCard } from "../../components/customer/CustomerCp";
import { tablesForScreen, openTable } from "../../db/screenDb";

export default function CTableScreen() {
  const db = useSQLiteContext();
  const query = useRestaurantQuery(() => tablesForScreen(db), "tables", true);
  const { run, busy } = useRestaurantAction();
  const [selected, setSelected] = useState(null);
  const select = () =>
    run(async () => {
      const billId = await openTable(db, selected.id);
      router.push({
        pathname: "/customer/menu",
        params: {
          billId,
        },
      });
    });

  return (
    <ScreenContent
      title="เลือกโต๊ะ"
      rightText="ลูกค้า"
    >
      <QueryState query={query}>
        <Text style={screenStyles.note}>
          เลือกโต๊ะเพื่อเปิดบิล หรือสั่งเพิ่มในบิลที่เปิดอยู่
        </Text>
        <View style={screenStyles.wrap}>
          {query.data?.map((table) => (
            <View
              key={table.id}
              style={screenStyles.table}
            >
              <CustomerTableCard
                tableNumber={table.number}
                status={table.status}
                onPress={() => setSelected(table)}
              />
            </View>
          ))}
        </View>
        {selected && (
          <SectionCard>
            <InfoRow
              label="โต๊ะที่เลือก"
              value={selected.number}
            />
            <PrimaryButton
              title={
                selected.billId ? "สั่งเพิ่ม / ดูบิล" : "เปิดบิลและเลือกอาหาร"
              }
              disabled={busy}
              onPress={select}
            />
          </SectionCard>
        )}
      </QueryState>
    </ScreenContent>
  );
}
