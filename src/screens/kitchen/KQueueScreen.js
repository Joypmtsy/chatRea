import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  ScreenContent,
  FilterBar,
  EmptyState,
  QueryState,
} from "../../components/common/ScreenContent";
import {
  useRestaurantQuery,
  useRestaurantAction,
} from "../../hooks/useRestaurantQuery";
import { screenStyles } from "../../styles/screenStyles";
import { displayTime } from "../../utils/format";
import {
  KitchenOrderCard,
  KitchenStatusButton,
} from "../../components/kitchen/KitchenCp";
import { kitchenForScreen, advanceKitchenItem } from "../../db/screenDb";
import { ORDER_FILTERS } from "../../utils/status";

export default function KQueueScreen() {
  const db = useSQLiteContext();
  const query = useRestaurantQuery(() => kitchenForScreen(db), "queue", true);
  const [filter, setFilter] = useState("all");
  const { run, busy } = useRestaurantAction();
  const filtered =
    query.data?.filter(
      (order) => filter === "all" || order.status === filter,
    ) || [];
  const advance = (order) =>
    run(async () => {
      await advanceKitchenItem(db, order.orderId, order.status);
      await query.refresh();
    });

  return (
    <ScreenContent
      title="คิวครัว"
      rightText="FIFO"
    >
      <QueryState query={query}>
        <FilterBar
          options={ORDER_FILTERS.filter((item) => item.key !== "served")}
          value={filter}
          onChange={setFilter}
        />
        {filtered.map((order) => (
          <View
            key={order.orderId}
            style={screenStyles.stack}
          >
            <KitchenOrderCard
              order={{
                ...order,
                createdAt: displayTime(order.createdAt),
              }}
              onPress={() =>
                router.push({
                  pathname: "/kitchen/detail",
                  params: {
                    roundId: order.roundId,
                  },
                })
              }
            />
            <KitchenStatusButton
              status={order.status}
              disabled={busy}
              onPress={() => advance(order)}
            />
          </View>
        ))}
        {!filtered.length && <EmptyState title="ไม่มีรายการในคิวครัว" />}
      </QueryState>
    </ScreenContent>
  );
}
