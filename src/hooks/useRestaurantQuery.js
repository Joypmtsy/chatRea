import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Alert } from "react-native";

export function useRestaurantQuery(load, key = "", poll = false) {
  const loader = useRef(load);
  useLayoutEffect(() => {
    loader.current = load;
  }, [load]);
  const mounted = useRef(false);
  const activeKey = useRef(key);
  const generation = useRef(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    const request = ++generation.current;
    const requestKey = activeKey.current;
    try {
      const result = await loader.current();
      if (
        mounted.current &&
        request === generation.current &&
        requestKey === activeKey.current
      ) {
        setData(result);
        setError("");
      }
    } catch (failure) {
      if (
        mounted.current &&
        request === generation.current &&
        requestKey === activeKey.current
      )
        setError(failure.message || "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      if (
        mounted.current &&
        request === generation.current &&
        requestKey === activeKey.current
      )
        setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      activeKey.current = key;
      mounted.current = true;
      setLoading(true);
      setData(null);
      void refresh();
      const interval = poll ? setInterval(refresh, 5000) : undefined;
      return () => {
        mounted.current = false;
        generation.current++;
        clearInterval(interval);
      };
    }, [key, poll, refresh]),
  );
  return { data, loading, error, refresh };
}

export function useRestaurantAction() {
  const guard = useRef(false);
  const [busy, setBusy] = useState(false);
  const run = async (task) => {
    if (guard.current) return;
    guard.current = true;
    setBusy(true);
    try {
      return await task();
    } catch (error) {
      Alert.alert("ดำเนินการไม่สำเร็จ", error.message || "กรุณาลองใหม่");
    } finally {
      guard.current = false;
      setBusy(false);
    }
  };
  return { run, busy };
}
