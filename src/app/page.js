"use client";

import { useState } from "react";
import FoodOrderForm from "./components/FoodOrderForm";
import OrderSummary from "./components/OrderSummary";
import { menuData } from "./data/globals";
import { sendOrderEmail } from "../utils/email";
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export default function Home() {
  const [menuState, setMenuState] = useState(menuData);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState(1);
  const [user, setUser] = useState();
  const [numberOfPeople, setNumberOfPeople] = useState(0);

  const calculateSubtotal = (order) => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = cart ? calculateSubtotal(cart) : 0;
  const gratuity = subtotal * 0.2;
  const tax = subtotal * 0.06;
  const grandTotal = subtotal + gratuity + tax;

  const goToOverview = async (fullName, email, phone) => {
    setView(2);
    setUser({ fullName, email, phone });
  };
  const generateOrderEmail = () => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 700px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="font-size: 24px; font-weight: bold; color: #333;">New Order for Moofy</h1>
        <div style="margin-bottom: 20px;">
          <p><strong>Client Full Name:</strong> ${user.fullName}</p>
          <p><strong>Client Email:</strong> ${user.email}</p>
          <p><strong>Client Phone number:</strong> ${user.phone}</p>
        </div>
  
        ${menuData
          .map((day) => {
            const dayOrders = cart.filter((item) => item.dayId === day.id);
            if (dayOrders.length === 0) return "";

            return `
              <div style="margin-bottom: 20px;">
                <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">${
                  day.name
                }</h2>
                ${day.meals
                  .map((meal) => {
                    const mealOrders = dayOrders.filter(
                      (item) => item.mealId === meal.id
                    );
                    if (mealOrders.length === 0) return "";

                    return `
                      <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-top: 10px;">
                        <h3 style="font-size: 18px; font-weight: bold;">${meal.type.toUpperCase()} - ${
                      meal.restaurant
                    }</h3>
                        <ul style="padding-left: 15px; margin-top: 10px;">
                          ${mealOrders
                            .map(
                              (item) => `
                                <li style="margin-bottom: 5px;">
                                  ${item.name} x${
                                item.quantity
                              } - ${formatCurrency(item.price * item.quantity)}
                                </li>
                              `
                            )
                            .join("")}
                        </ul>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            `;
          })
          .join("")}
  
        <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
        <div style="font-size: 16px;">
          <p><strong>Subtotal:</strong> ${formatCurrency(subtotal)}</p>
          <p><strong>Gratuity (20%):</strong> ${formatCurrency(gratuity)}</p>
          <p><strong>Tax (6%):</strong> ${formatCurrency(tax)}</p>
        </div>
        <hr style="border-top: 1px solid #ddd; margin: 20px 0;">
        <div style="font-size: 18px; font-weight: bold;">
          <p><strong>Grand Total:</strong> ${formatCurrency(grandTotal)}</p>
        </div>
      </div>
    `;
  };

  const submitOrder = async () => {
    try {
      const emailContent = generateOrderEmail();
      await sendOrderEmail(user, cart, {
        subtotal,
        gratuity,
        tax,
        grandTotal,
        htmlContent: emailContent,
      });

      setView(3);
    } catch (error) {
      alert("Failed to submit order. Please try again.");
    }
  };

  return (
    <main className="p-6 bg-gray-100 h-full">
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
            Gratuity for setup and delivery You’re responsible for throwing
            plates in the garbage and putting any leftovers in the fridge and
            general cleanup. Additional cleanup can be billed as as a separate
            charge.
            <br />
            <br />
            *All pricing is based per/person.
            <div className="mt-6">
              <div>
                <label className="block mb-1 text-gray-700 text-sm font-medium">
                  Enter the number of people you are ordering for
                </label>
                <input
                  type="number"
                  min="0"
                  value={numberOfPeople}
                  onChange={(e) => {
                    const value =
                      parseInt(e.target.value.replace(/^0+/, "")) || 0;
                    setNumberOfPeople(Math.max(0, value));
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/^0+/, "");
                  }}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter the number of people"
                />
              </div>
            </div>
          </div>
          <div className="flex items-start justify-between">
            <div className="w-[60%]">
              <FoodOrderForm
                menuState={menuState}
                cart={cart}
                setCart={setCart}
                numberOfPeople={numberOfPeople}
              />
            </div>
            <div className="relative w-[40%] ml-[25px]">
              <OrderSummary order={cart} goToOverview={goToOverview} />
            </div>
          </div>
        </>
      ) : view == 2 ? (
        <div className="bg-white max-w-[700px] mx-auto p-6 border border-gray-200 rounded-lg text-sm text-black mb-6">
          <div className="mb-6">
            <a onClick={() => setView(1)} className="underline cursor-pointer">
              {"<"} Go back
            </a>
          </div>
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
                                {formatCurrency(item.price * item.quantity)}
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
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Gratuity (20%):</span>
              <span className="font-medium">{formatCurrency(gratuity)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (6%):</span>
              <span className="font-medium">{formatCurrency(tax)}</span>
            </div>
          </div>
          <hr className="my-4 border-gray-300" />
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Grand Total:</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
          <button
            className={`cursor-pointer w-full bg-blue-600 py-2 mt-6 rounded-lg text-white font-semibold hover:bg-blue-700 transition`}
            onClick={() => submitOrder()}
          >
            Submit Order
          </button>
        </div>
      ) : (
        <div className="bg-white max-w-[700px] mx-auto p-6 border border-gray-200 rounded-lg text-sm text-black mb-6">
          <h1 className="text-3xl font-bold mb-4 text-black">
            Thank you for your order!
          </h1>
          <p className="mt-2">
            Someone from our team will be in touch with you shortly!
          </p>
        </div>
      )}
    </main>
  );
}
