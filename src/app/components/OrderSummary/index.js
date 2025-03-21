import { useState, useEffect } from "react";
import CheckboxInput from "../shared/CheckboxInput";
import TextInput from "../shared/TextInput";
import { useSelector } from "react-redux";
import { formatCurrency } from "@/app/data/globals";
import {
  removeItem,
  setUser,
  toggleCleanupDishware,
  toggleCleanupService,
} from "@/app/store";
import { useDispatch } from "react-redux";

export default function OrderSummary({
  goToOverview,
  subtotal,
  gratuity,
  tax,
  cleanUpService,
  cleanUpDishware,
  grandTotal,
}) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.order.cart);
  const user = useSelector((state) => state.order.user);
  const checkinDate = useSelector((state) => state.order.checkinDate);
  const numberOfPeople = useSelector((state) => state.order.numberOfPeople);
  const includeCleanupService = useSelector(
    (state) => state.order.includeCleanupService
  );
  const includeCleanupDishware = useSelector(
    (state) => state.order.includeCleanupDishware
  );
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const isFormValid =
      user.fullName &&
      checkinDate &&
      numberOfPeople > 0 &&
      user.email &&
      user.phone &&
      !emailError &&
      !phoneError;
    setIsButtonDisabled(!isFormValid || cart.length === 0);
  }, [
    user.fullName,
    numberOfPeople,
    checkinDate,
    user.email,
    user.phone,
    emailError,
    phoneError,
    cart,
  ]);

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
    dispatch(setUser({ ...user, phone: formatted }));
    setPhoneError(
      /^\(\d{3}\) \d{3}-\d{4}$/.test(formatted) ? "" : "Invalid phone number"
    );
  };

  return (
    <div className="p-6 border border-gray-200 bg-white text-gray-800 w-full rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">
        🛒 Order Summary
      </h2>

      <div className="space-y-3">
        {cart?.map((item, index) => (
          <div key={index} className="flex justify-between items-center group">
            <span className="text-gray-700">
              {item.name}{" "}
              <span className="text-gray-500">x{item.quantity}</span>
            </span>
            <div className="flex items-center">
              <span className="font-medium mr-3">
                {formatCurrency(item.price * item.quantity)}
              </span>
              <button
                onClick={() => dispatch(removeItem({ item }))}
                className="transition-opacity text-red-500 hover:text-red-700"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart?.length > 0 && <hr className="my-4 border-gray-300" />}

      <div className="space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span className="pr-4">Subtotal:</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="pr-4">Gratuity (20%):</span>
          <span className="font-medium">{formatCurrency(gratuity)}</span>
        </div>
        <div className="flex justify-between">
          <span className="pr-4">Tax (6%):</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between items-center group">
          <span className="pr-4">
            Clean up Service ($3.00 / Person / Meal):
          </span>
          <div className="flex items-center">
            <span className="font-medium mr-3">
              {formatCurrency(cleanUpService)}
            </span>
            <CheckboxInput
              checked={includeCleanupService}
              onChange={(e) => dispatch(toggleCleanupService())}
              className="w-5 h-5"
            />
          </div>
        </div>
        <div className="flex justify-between items-center group">
          <span className="pr-4">
            Clean up, dishware 2 Hours helper ($6.00 / Person / Meal):
          </span>
          <div className="flex items-center">
            <span className="font-medium mr-3">
              {formatCurrency(cleanUpDishware)}
            </span>
            <CheckboxInput
              checked={includeCleanupDishware}
              onChange={(e) => dispatch(toggleCleanupDishware())}
              className="w-5 h-5"
            />
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      <div className="flex justify-between text-xl font-bold text-gray-900">
        <span className="pr-4">Grand Total:</span>
        <span>{formatCurrency(grandTotal)}</span>
      </div>

      <div className="mt-6 gap-6 grid grid-cols-2">
        <div className="col-span-2 md:col-span-1">
          <label className="block mb-1 text-gray-700 text-sm font-medium">
            Full Name<span className="text-red-500">*</span>
          </label>
          <TextInput
            value={user.fullName}
            onChange={(e) =>
              dispatch(setUser({ ...user, fullName: e.target.value }))
            }
            placeholder="Enter your full name"
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block mb-1 text-gray-700 text-sm font-medium">
            Email<span className="text-red-500">*</span>
          </label>
          <TextInput
            type="email"
            value={user.email}
            onChange={(e) => {
              dispatch(setUser({ ...user, email: e.target.value }));
              validateEmail(e.target.value);
            }}
            placeholder="Enter your email"
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block mb-1 text-gray-700 text-sm font-medium">
            Phone Number<span className="text-red-500">*</span>
          </label>
          <TextInput
            type="tel"
            value={user.phone}
            onChange={handlePhoneChange}
            placeholder="(123) 456-7890"
          />
          {phoneError && (
            <p className="text-red-500 text-sm mt-1">{phoneError}</p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block mb-1 text-gray-700 text-sm font-medium">
            Add any additional note (Optional){" "}
          </label>
          <textarea
            value={user.additionalNote}
            onChange={(e) =>
              dispatch(setUser({ ...user, additionalNote: e.target.value }))
            }
            className="min-w-full md:min-h-[80px] p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Additional note"
          />
        </div>
      </div>

      <button
        className={`${
          isButtonDisabled && "opacity-60 pointer-events-none"
        } cursor-pointer w-full bg-blue-600 py-2 mt-6 rounded-lg text-white font-semibold hover:bg-blue-700 transition`}
        onClick={() => goToOverview()}
        disabled={isButtonDisabled}
      >
        Checkout & Review
      </button>
    </div>
  );
}
