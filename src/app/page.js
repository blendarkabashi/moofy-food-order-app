"use client";

import { useState } from "react";
import FoodOrderForm from "./components/FoodOrderForm";
import OrderSummary from "./components/OrderSummary";
import { menuData } from "./data/globals";

export default function Home() {
  const [menuState, setMenuState] = useState(menuData);
  const [cart, setCart] = useState([]);

  const submitOrder = async () => {
    console.log("test");
    console.log(filterValidMeals(menuState));
    // await fetch("/api/sendOrder", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(filterValidMeals(menuState)),
    // });
    // alert("Order Sent!");
  };

  return (
    <main className="p-6 bg-gray-100 shadow-lg h-full">
      <h1 className="text-3xl font-bold mb-4 text-black">Order Your Food</h1>
      <div className="flex items-start justify-between">
        <div className="w-[60%]">
          <FoodOrderForm menuState={menuState} cart={cart} setCart={setCart} />
        </div>
        <div className="relative w-[40%] ml-[25px]">
          <OrderSummary order={cart} submitOrder={submitOrder} />
        </div>
      </div>
    </main>
  );
}
