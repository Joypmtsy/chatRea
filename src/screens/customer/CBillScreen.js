import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  ScreenContent,
  EmptyState,
  QueryState,
} from "../../components/common/ScreenContent";
import {
  SectionCard,
  InfoRow,
  StatusBadge,
} from "../../components/common/CommonCp";
import { useRestaurantQuery } from "../../hooks/useRestaurantQuery";
import { appStyles } from "../../styles/appStyles";
import { screenStyles } from "../../styles/screenStyles";
import { baht, tableNumber, displayTime } from "../../utils/format";
import { BillItem } from "../../components/customer/CustomerCp";
import { CustomerNavigation } from "../../components/customer/CustomerNavigation";
import { billForScreen } from "../../db/screenDb";

export default function CBillScreen() {
  const { billId } = useLocalSearchParams();
  const db = useSQLiteContext();
  const query = useRestaurantQuery(
    () => billForScreen(db, billId),
    String(billId),
    true,
  );
  const bill = query.data;

  return (
    <ScreenContent
      title="บิลของฉัน"
      rightText={bill ? "โต๊ะ " + tableNumber(bill.tableNumber) : "ลูกค้า"}
    >
      <CustomerNavigation billId={billId} />
      <QueryState query={query}>
        {bill && (
          <>
            <SectionCard>
              <InfoRow
                label="Bill"
                value={"#" + bill.bill_id}
              />
              <InfoRow
                label="เวลาเปิด"
                value={displayTime(bill.opened_at)}
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
                  <BillItem
                    key={item.order_item_id}
                    item={{
                      name: item.menu_name,
                      quantity: item.quantity,
                      priceAtOrder: item.price_at_order / 100,
                      note: item.note,
                    }}
                  />
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
              <Text style={screenStyles.note}>
                ติดต่อพนักงานเพื่อชำระเงินและปิดบิล
              </Text>
            </SectionCard>
          </>
        )}
      </QueryState>
    </ScreenContent>
  );
}
