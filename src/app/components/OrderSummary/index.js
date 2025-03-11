import { useState } from "react";

export default function OrderSummary({ order, submitOrder }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(re.test(email) ? "" : "Invalid email format");
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    setPhoneError(
      /^\(\d{3}\) \d{3}-\d{4}$/.test(formatted) ? "" : "Invalid phone number"
    );
  };

  const calculateSubtotal = (order) => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = order ? calculateSubtotal(order) : 0;
  const gratuity = subtotal * 0.2;
  const tax = subtotal * 0.06;
  const grandTotal = subtotal + gratuity + tax;

  return (
    <div className="p-6 border border-gray-200 bg-white text-gray-800 w-full rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">
        🛒 Order Summary
      </h2>

      <div className="space-y-3">
        {order?.map((item, index) => (
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

      <hr className="my-4 border-gray-300" />

      <div className="space-y-2 text-gray-700">
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

      <div className="mt-6 gap-6 grid grid-cols-2">
        <div>
          <label className="block mb-1 text-gray-700 text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your email"
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block mb-1 text-gray-700 text-sm font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="(123) 456-7890"
          />
          {phoneError && (
            <p className="text-red-500 text-sm mt-1">{phoneError}</p>
          )}
        </div>
      </div>

      <button
        className={`${
          (emailError || phoneError) && "opacity-60 pointer-events-none"
        } cursor-pointer w-full bg-blue-600 py-2 mt-6 rounded-lg text-white font-semibold hover:bg-blue-700 transition`}
        onClick={() => submitOrder({ fullName, email, phone })}
        disabled={emailError || phoneError}
      >
        Checkout & Review
      </button>
    </div>
  );
}
