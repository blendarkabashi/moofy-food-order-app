"use client";

import { useState } from "react";
import FoodOrderForm from "./components/FoodOrderForm";
import OrderSummary from "./components/OrderSummary";
import { menuData } from "./data/globals";

export default function Home() {
  const [menuState, setMenuState] = useState(menuData);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState(1);
  const [user, setUser] = useState();

  const submitOrder = async (fullName, email, phone) => {
    setView(2);
    setUser({ fullName, email, phone });
    // await fetch("/api/sendOrder", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(filterValidMeals(menuState)),
    // });
    // alert("Order Sent!");
  };

  return (
    <main className="p-6 bg-gray-100 shadow-lg h-full">
      {view == 1 ? (
        <>
          <div className="bg-white p-6 border border-gray-200 rounded-lg text-sm text-black mb-6">
            <h1 className="text-3xl font-bold mb-4 text-black">
              Order Your Food
            </h1>
            In order to provide the most affordable meal options for our guests,
            we have partnered with local restaurants to provide catered food
            service. Our staff will pickup/ deliver to your door and setup
            buffet style with paper plates. You pay these prices below + 18%
            Gratuity for setup and delivery. You’re responsible for throwing
            plates in the garbage and putting any leftovers in the fridge and
            general cleanup. Additional cleanup can be billed as as a separate
            charge.
            <br /> <br />
            *All pricing is based per/person.
          </div>
          <div className="flex items-start justify-between">
            <div className="w-[60%]">
              <FoodOrderForm
                menuState={menuState}
                cart={cart}
                setCart={setCart}
              />
            </div>
            <div className="relative w-[40%] ml-[25px]">
              <OrderSummary order={cart} submitOrder={submitOrder} />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 border border-gray-200 rounded-lg text-sm text-black mb-6">
          <h1 className="text-3xl font-bold mb-4 text-black">Your Order</h1>
          {user.fullName} - {user.email} - {user.phone}
          <div className="space-y-3">
            {cart?.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">
                  {item.name}{" "}
                  <span className="text-gray-500">x{item.quantity}</span>
                </span>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
