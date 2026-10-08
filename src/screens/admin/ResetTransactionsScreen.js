import React, { useState } from "react";
import { Alert, Text, TextInput } from "react-native";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ScreenContent } from "../../components/common/ScreenContent";
import { SectionCard, PrimaryButton } from "../../components/common/CommonCp";
import { useRestaurantAction } from "../../hooks/useRestaurantQuery";
import { appStyles } from "../../styles/appStyles";
import { screenStyles } from "../../styles/screenStyles";
import { WarningCard } from "../../components/admin/AdminCp";
import { clearTransactions } from "../../db/screenDb";
import { useCart } from "../../context/CartContext";

export default function ResetTransactionsScreen() {
  const db = useSQLiteContext();
  const { run, busy } = useRestaurantAction();
  const [confirmation, setConfirmation] = useState("");
  const cart = useCart("");
  const reset = () =>
    Alert.alert(
      "ยืนยันล้างรายการขายทั้งหมด",
      "ลบบิล ออเดอร์ การชำระเงิน และประวัติย้ายโต๊ะทั้งหมด ย้อนกลับไม่ได้",
      [
        {
          text: "ยกเลิก",
          style: "cancel",
        },
        {
          text: "ล้างข้อมูล",
          style: "destructive",
          onPress: () =>
            run(async () => {
              await clearTransactions(db);
              cart.clearAll();
              setConfirmation("");
              Alert.alert("สำเร็จ", "ล้างรายการขายแล้ว โต๊ะและเมนูยังอยู่");
              router.replace("/admin/dashboard");
            }),
        },
      ],
    );

  return (
    <ScreenContent
      title="ล้างรายการขาย"
      rightText="ผู้ดูแล"
    >
      <WarningCard
        title="ข้อมูลที่จะถูกลบ"
        message="บิล รอบออเดอร์ รายการอาหาร การชำระเงิน และประวัติย้ายโต๊ะทั้งหมด"
      />
      <SectionCard>
        <Text style={screenStyles.note}>
          เก็บข้อมูลโต๊ะ หมวดหมู่ เมนู และประวัติราคาไว้ พิมพ์ RESET
          เพื่อเปิดปุ่มยืนยัน
        </Text>
        <TextInput
          style={[appStyles.input, screenStyles.input]}
          value={confirmation}
          onChangeText={setConfirmation}
          placeholder="RESET"
          autoCapitalize="characters"
          editable={!busy}
        />
        <PrimaryButton
          title="ล้างรายการขายทั้งหมด"
          disabled={busy || confirmation !== "RESET"}
          onPress={reset}
          style={appStyles.marginTopMd}
        />
      </SectionCard>
    </ScreenContent>
  );
}
