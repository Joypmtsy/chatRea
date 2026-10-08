import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [carts, setCarts] = useState({});
  const [notes, setNotes] = useState({});
  const update = (billId, menu, delta) =>
    setCarts((current) => {
      const cart = current[billId] || [];
      const exists = cart.some((item) => item.id === menu.id);
      return {
        ...current,
        [billId]: (exists
          ? cart.map((item) =>
              item.id === menu.id ? { ...item, qty: item.qty + delta } : item,
            )
          : [...cart, { ...menu, qty: delta }]
        ).filter((item) => item.qty > 0),
      };
    });
  const clear = (billId) => {
    setCarts((current) => ({ ...current, [billId]: [] }));
    setNotes((current) => ({ ...current, [billId]: "" }));
  };
  const clearAll = () => {
    setCarts({});
    setNotes({});
  };

  return (
    <CartContext.Provider
      value={{
        carts,
        notes,
        update,
        clear,
        clearAll,
        setItemNote: (id, menuId, note) =>
          setCarts((current) => ({
            ...current,
            [id]: (current[id] || []).map((item) =>
              item.id === menuId ? { ...item, note } : item,
            ),
          })),
        setNote: (id, note) =>
          setNotes((current) => ({ ...current, [id]: note })),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart(billId) {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartProvider is missing");
  return {
    items: context.carts[billId] || [],
    note: context.notes[billId] || "",
    add: (menu) => context.update(billId, menu, 1),
    decrease: (menu) => context.update(billId, menu, -1),
    clear: () => context.clear(billId),
    clearAll: context.clearAll,
    setItemNote: (menuId, note) => context.setItemNote(billId, menuId, note),
    setNote: (note) => context.setNote(billId, note),
  };
}
