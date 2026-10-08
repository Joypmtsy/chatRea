import React, { useState } from "react";
import { Text, TextInput } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import {
  ScreenContent,
  FilterBar,
  EmptyState,
  QueryState,
} from "../../components/common/ScreenContent";
import { SectionCard, PrimaryButton } from "../../components/common/CommonCp";
import {
  useRestaurantQuery,
  useRestaurantAction,
} from "../../hooks/useRestaurantQuery";
import { appStyles } from "../../styles/appStyles";
import { parsePrice } from "../../utils/format";
import { MenuManageRow } from "../../components/admin/AdminCp";
import {
  menusForScreen,
  setMenuPrice,
  setMenuAvailable,
} from "../../db/screenDb";

export default function AMenuScreen() {
  const db = useSQLiteContext();
  const query = useRestaurantQuery(() => menusForScreen(db), "menus");
  const { run, busy } = useRestaurantAction();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [price, setPrice] = useState("");
  const data = query.data;
  const filtered =
    data?.menus.filter(
      (menu) =>
        (category === "all" || menu.categoryId === category) &&
        menu.name.includes(search.trim()),
    ) || [];
  const save = () =>
    run(async () => {
      await setMenuPrice(db, editing.id, parsePrice(price));
      setEditing(null);
      await query.refresh();
    });

  return (
    <ScreenContent
      title="จัดการเมนู"
      rightText="ผู้ดูแล"
    >
      <QueryState query={query}>
        <TextInput
          style={appStyles.input}
          value={search}
          onChangeText={setSearch}
          placeholder="ค้นหาเมนู"
        />
        <FilterBar
          options={[
            {
              key: "all",
              label: "ทั้งหมด",
            },
            ...(data?.categories || []).map((item) => ({
              key: item.id,
              label: item.name,
            })),
          ]}
          value={category}
          onChange={setCategory}
        />
        {editing && (
          <SectionCard>
            <Text style={appStyles.sectionTitle}>{editing.name}</Text>
            <TextInput
              style={appStyles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              placeholder="ราคา (บาท)"
              editable={!busy}
            />
            <PrimaryButton
              title="บันทึกราคา"
              disabled={busy}
              onPress={save}
              style={appStyles.marginTopMd}
            />
            <PrimaryButton
              title="ยกเลิก"
              disabled={busy}
              onPress={() => setEditing(null)}
              style={appStyles.marginTopMd}
            />
          </SectionCard>
        )}
        {filtered.map((menu) => (
          <MenuManageRow
            key={menu.id}
            menuName={menu.name}
            categoryName={menu.categoryName}
            price={menu.price}
            isAvailable={menu.available}
            disabled={busy}
            onEdit={() => {
              setEditing(menu);
              setPrice(String(menu.price));
            }}
            onToggle={() =>
              run(async () => {
                await setMenuAvailable(db, menu.id, !menu.available);
                await query.refresh();
              })
            }
          />
        ))}
        {!filtered.length && <EmptyState />}
      </QueryState>
    </ScreenContent>
  );
}
