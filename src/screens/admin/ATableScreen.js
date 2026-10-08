import React, { useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  ScreenContent,
  FilterBar,
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
import { TableCard, SummaryCard } from "../../components/admin/AdminCp";
import { tablesForScreen, moveTable, openTable } from "../../db/screenDb";

export default function ATableScreen() {
  const db = useSQLiteContext();
  const query = useRestaurantQuery(() => tablesForScreen(db), "tables", true);
  const { run, busy } = useRestaurantAction();
  const [selectedId, setSelectedId] = useState(null);
  const [destinationId, setDestinationId] = useState(null);
  const tables = query.data || [];
  const selected = tables.find((table) => table.id === selectedId);
  const destination = tables.find(
    (table) => table.id === destinationId && !table.billId,
  );
  const move = () =>
    run(async () => {
      await moveTable(db, selected.billId, selected.id, destination.id);
      setSelectedId(null);
      setDestinationId(null);
      await query.refresh();
    });

  return (
    <ScreenContent
      title="จัดการโต๊ะ"
      rightText="ผู้ดูแล"
    >
      <QueryState query={query}>
        <SummaryCard
          title="โต๊ะว่าง"
          value={tables.filter((table) => !table.billId).length}
        />
        <View style={screenStyles.wrap}>
          {tables.map((table) => (
            <View
              key={table.id}
              style={screenStyles.table}
            >
              <TableCard
                tableNumber={table.number}
                status={table.status}
                onPress={() => {
                  setSelectedId(table.id);
                  setDestinationId(null);
                }}
              />
            </View>
          ))}
        </View>
        {selected && (
          <SectionCard>
            <InfoRow
              label="โต๊ะ"
              value={selected.number}
            />
            <StatusBadge status={selected.status} />
            <PrimaryButton
              title={selected.billId ? "ดูบิล / ชำระเงิน" : "เปิดบิล"}
              disabled={busy}
              style={appStyles.marginTopMd}
              onPress={() =>
                run(async () => {
                  const billId =
                    selected.billId || (await openTable(db, selected.id));
                  router.push({
                    pathname: "/admin/bill",
                    params: {
                      billId,
                    },
                  });
                })
              }
            />
            {selected.billId && (
              <>
                <Text style={appStyles.sectionTitle}>ย้ายไปโต๊ะว่าง</Text>
                <FilterBar
                  options={tables
                    .filter((table) => !table.billId)
                    .map((table) => ({
                      key: table.id,
                      label: table.number,
                    }))}
                  value={destinationId}
                  onChange={setDestinationId}
                />
                <PrimaryButton
                  title="ย้ายโต๊ะ"
                  disabled={busy || !destination}
                  onPress={move}
                  style={appStyles.marginTopMd}
                />
              </>
            )}
          </SectionCard>
        )}
      </QueryState>
    </ScreenContent>
  );
}
