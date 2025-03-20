import { useState, useEffect } from "react";

export default function OrderSummary({
  order,
  goToOverview,
  onRemoveItem,
  numberOfPeople,
  checkinDate,
  includeCleanupService,
  setIncludeCleanupService,
  includeCleanupDishware,
  setIncludeCleanupDishware,
  subtotal,
  gratuity,
  tax,
  cleanUpService,
  cleanUpDishware,
  grandTotal,
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const isFormValid =
      fullName &&
      checkinDate &&
      numberOfPeople > 0 &&
      email &&
      phone &&
      !emailError &&
      !phoneError;
    setIsButtonDisabled(!isFormValid || order.length === 0);
  }, [
    fullName,
    numberOfPeople,
    checkinDate,
    email,
    phone,
    emailError,
    phoneError,
    order,
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
    setPhone(formatted);
    setPhoneError(
      /^\(\d{3}\) \d{3}-\d{4}$/.test(formatted) ? "" : "Invalid phone number"
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="p-6 border border-gray-200 bg-white text-gray-800 w-full rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">
        🛒 Order Summary
      </h2>

      <div className="space-y-3">
        {order?.map((item, index) => (
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
                onClick={() => onRemoveItem(item)}
                className="transition-opacity text-red-500 hover:text-red-700"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {order?.length > 0 && <hr className="my-4 border-gray-300" />}

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
            <input
              type="checkbox"
              checked={includeCleanupService}
              onChange={(e) => setIncludeCleanupService(!includeCleanupService)}
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
            <input
              type="checkbox"
              checked={includeCleanupDishware}
              onChange={(e) =>
                setIncludeCleanupDishware(!includeCleanupDishware)
              }
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
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your full name"
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block mb-1 text-gray-700 text-sm font-medium">
            Email<span className="text-red-500">*</span>
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
            Phone Number<span className="text-red-500">*</span>
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
        <div className="col-span-2">
          <label className="block mb-1 text-gray-700 text-sm font-medium">
            Add any additional note (Optional){" "}
          </label>
          <textarea
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
            className="min-w-full md:min-h-[80px] p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Additional note"
          />
        </div>
      </div>

      <button
        className={`${
          isButtonDisabled && "opacity-60 pointer-events-none"
        } cursor-pointer w-full bg-blue-600 py-2 mt-6 rounded-lg text-white font-semibold hover:bg-blue-700 transition`}
        onClick={() => goToOverview(fullName, email, phone, additionalNote)}
        disabled={isButtonDisabled}
      >
        Checkout & Review
      </button>
    </div>
  );
}
