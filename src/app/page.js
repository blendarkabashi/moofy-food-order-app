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

  const calculateSubtotal = (order) => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = cart ? calculateSubtotal(cart) : 0;
  const gratuity = subtotal * 0.2;
  const tax = subtotal * 0.06;
  const grandTotal = subtotal + gratuity + tax;

  const submitOrder = async (fullName, email, phone) => {
    setView(2);
    setUser({ fullName, email, phone });
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
            service.
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
          <div className="mb-6">
            <div>Full Name: {user.fullName}</div>
            <div>Email: {user.email}</div>
            <div>Phone number: {user.phone}</div>
          </div>

          <div className="space-y-6">
            {menuData.map((day) => {
              const dayOrders = cart.filter((item) => item.dayId === day.id);
              if (dayOrders.length === 0) return null;

              return (
                <div key={day.id}>
                  <h2 className="text-xl font-bold mt-4">{day.name}</h2>
                  {day.meals.map((meal) => {
                    const mealOrders = dayOrders.filter(
                      (item) => item.mealId === meal.id
                    );
                    if (mealOrders.length === 0) return null;

                    return (
                      <div
                        key={meal.id}
                        className="border border-gray-200 p-4 rounded-lg shadow mt-2"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">
                          {meal.type.toUpperCase()} - {meal.restaurant}
                        </h3>
                        <div className="mt-2 space-y-2">
                          {mealOrders.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center"
                            >
                              <span className="text-gray-700">
                                {item.name}{" "}
                                <span className="text-gray-500">
                                  x{item.quantity}
                                </span>
                              </span>
                              <span className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <hr className="my-4 border-gray-300" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Gratuity (20%):</span>
              <span className="font-medium">${gratuity.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (6%):</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
          </div>
          <hr className="my-4 border-gray-300" />
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Grand Total:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </main>
  );
}
