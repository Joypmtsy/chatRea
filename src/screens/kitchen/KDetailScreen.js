import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  ScreenContent,
  EmptyState,
  QueryState,
} from "../../components/common/ScreenContent";
import { SectionCard, InfoRow } from "../../components/common/CommonCp";
import {
  useRestaurantQuery,
  useRestaurantAction,
} from "../../hooks/useRestaurantQuery";
import { tableNumber } from "../../utils/format";
import {
  KitchenOrderItem,
  KitchenStatusButton,
} from "../../components/kitchen/KitchenCp";
import { advanceKitchenItem, kitchenDetailForScreen } from "../../db/screenDb";

export default function KDetailScreen() {
  const { roundId } = useLocalSearchParams();
  const db = useSQLiteContext();
  const { run, busy } = useRestaurantAction();
  const query = useRestaurantQuery(
    () => kitchenDetailForScreen(db, roundId),
    String(roundId),
    true,
  );

  return (
    <ScreenContent
      title="รายละเอียดรอบออเดอร์"
      rightText="ครัว"
    >
      <QueryState query={query}>
        {query.data && (
          <>
            <SectionCard>
              <InfoRow
                label="โต๊ะ"
                value={tableNumber(query.data.round.table_number)}
              />
              <InfoRow
                label="Round"
                value={query.data.round.round_number}
              />
              <InfoRow
                label="Bill"
                value={"#" + query.data.round.bill_id}
              />
            </SectionCard>
            {query.data.items.map((item) => (
              <SectionCard key={item.order_item_id}>
                <KitchenOrderItem
                  item={{
                    menuName: item.menu_name,
                    quantity: item.quantity,
                    note: item.note,
                    status: item.status,
                  }}
                />
                <KitchenStatusButton
                  status={item.status}
                  disabled={busy || item.status === "served"}
                  onPress={() =>
                    run(async () => {
                      await advanceKitchenItem(
                        db,
                        item.order_item_id,
                        item.status,
                      );
                      await query.refresh();
                    })
                  }
                />
              </SectionCard>
            ))}
            {!query.data.items.length && <EmptyState />}
          </>
        )}
      </QueryState>
    </ScreenContent>
  );
}
