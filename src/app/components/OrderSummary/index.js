export default function OrderSummary({ order, submitOrder }) {
  const calculateSubtotal = (order) => {
    return order.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const subtotal = order ? calculateSubtotal(order) : 0;
  const gratuity = subtotal * 0.2;
  const tax = subtotal * 0.06;
  const grandTotal = subtotal + gratuity + tax;

  return (
    <div className="p-6 border border-gray-200 bg-white text-gray-800 w-full rounded-lg mt-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">
        🛒 Order Summary
      </h2>

      <div className="space-y-3">
        {order
          ? order.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">
                  {item.name}{" "}
                  <span className="text-gray-500">x{item.quantity}</span>
                </span>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))
          : null}
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
        <span className="">${grandTotal.toFixed(2)}</span>
      </div>
      <button
        className="cursor-pointer w-full bg-blue-600 py-2 mt-4 rounded-lg text-white hover:bg-blue-700 transition"
        onClick={submitOrder}
      >
        Checkout & Review
      </button>
    </div>
  );
}
