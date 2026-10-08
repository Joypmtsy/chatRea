import React, { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  ScreenContent,
  FilterBar,
  EmptyState,
  QueryState,
} from "../../components/common/ScreenContent";
import { useRestaurantQuery } from "../../hooks/useRestaurantQuery";
import { screenStyles } from "../../styles/screenStyles";
import { tableNumber } from "../../utils/format";
import { OrderStatusCard } from "../../components/customer/CustomerCp";
import { SummaryCard } from "../../components/admin/AdminCp";
import { CustomerNavigation } from "../../components/customer/CustomerNavigation";
import { billForScreen } from "../../db/screenDb";
import { ORDER_FILTERS } from "../../utils/status";

export default function COrderScreen() {
  const { billId } = useLocalSearchParams();
  const db = useSQLiteContext();
  const [filter, setFilter] = useState("all");
  const query = useRestaurantQuery(
    () => billForScreen(db, billId),
    String(billId),
    true,
  );
  const bill = query.data;
  const orders =
    bill?.rounds.flatMap((round) =>
      round.items.map((item) => ({
        id: item.order_item_id,
        round: round.round_number,
        menu: item.menu_name,
        quantity: item.quantity,
        price: item.price_at_order / 100,
        note: item.note,
        status: item.status,
      })),
    ) || [];
  const filtered = orders.filter(
    (order) => filter === "all" || order.status === filter,
  );

  return (
    <ScreenContent
      title="สถานะออเดอร์"
      rightText={bill ? "โต๊ะ " + tableNumber(bill.tableNumber) : "ลูกค้า"}
    >
      <CustomerNavigation billId={billId} />
      <QueryState query={query}>
        <View style={screenStyles.wrap}>
          {ORDER_FILTERS.slice(1).map((item) => (
            <View
              key={item.key}
              style={screenStyles.summary}
            >
              <SummaryCard
                title={item.label}
                value={
                  orders.filter((order) => order.status === item.key).length
                }
              />
            </View>
          ))}
        </View>
        <FilterBar
          options={ORDER_FILTERS}
          value={filter}
          onChange={setFilter}
        />
        {filtered.map((order) => (
          <OrderStatusCard
            key={order.id}
            order={order}
          />
        ))}
        {!filtered.length && <EmptyState title="ยังไม่มีออเดอร์ในสถานะนี้" />}
      </QueryState>
    </ScreenContent>
  );
}
