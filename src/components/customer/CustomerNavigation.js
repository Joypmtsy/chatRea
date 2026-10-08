import React from "react";
import { router } from "expo-router";
import { View } from "react-native";
import { PrimaryButton } from "../common/CommonCp";
import { screenStyles } from "../../styles/screenStyles";

export function CustomerNavigation({ billId }) {
  return (
    <View style={screenStyles.wrap}>
      {[
        {
          title: "เมนู",
          open: () =>
            router.navigate({ pathname: "/customer/menu", params: { billId } }),
        },
        {
          title: "ตะกร้า",
          open: () =>
            router.navigate({ pathname: "/customer/cart", params: { billId } }),
        },
        {
          title: "สถานะ",
          open: () =>
            router.navigate({
              pathname: "/customer/orders",
              params: { billId },
            }),
        },
        {
          title: "บิล",
          open: () =>
            router.navigate({ pathname: "/customer/bill", params: { billId } }),
        },
      ].map(({ title, open }) => (
        <PrimaryButton
          key={title}
          title={title}
          onPress={open}
        />
      ))}
    </View>
  );
}
