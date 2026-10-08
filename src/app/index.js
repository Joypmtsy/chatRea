import React from "react";
import { router } from "expo-router";
import { Text } from "react-native";
import { ScreenContent } from "../components/common/ScreenContent";
import { QuickActionButton } from "../components/admin/AdminCp";
import { appStyles } from "../styles/appStyles";

export default function HomeScreen() {
  return (
    <ScreenContent
      title="HONEY RESTAURANT"
      subtitle="ระบบสั่งอาหารและจัดการร้าน"
    >
      <Text style={appStyles.sectionTitle}>เลือกส่วนที่ต้องการใช้งาน</Text>
      <QuickActionButton
        title="ลูกค้า"
        subtitle="เลือกโต๊ะ สั่งอาหาร ดูสถานะและบิล"
        onPress={() => router.push("/customer/tables")}
      />
      <QuickActionButton
        title="ครัว"
        subtitle="คิวอาหารและเปลี่ยนสถานะการทำอาหาร"
        onPress={() => router.push("/kitchen/queue")}
      />
      <QuickActionButton
        title="ผู้ดูแลร้าน"
        subtitle="โต๊ะ เมนู รับชำระเงิน และรายงาน"
        onPress={() => router.push("/admin/dashboard")}
      />
    </ScreenContent>
  );
}
