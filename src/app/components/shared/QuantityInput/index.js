import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const QuantityInput = ({ onUpdate, item, value }) => {
  const cart = useSelector((state) => state.order.cart);

  return (
    <div className="flex items-center">
      <button
        onClick={() => onUpdate(value - 1)}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300"
      >
        -
      </button>
      <input
        type="number"
        value={value}
        min="0"
        onChange={(e) =>
          onUpdate(parseInt(e.target.value.replace(/^0+/, "")) || 0)
        }
        onInput={(e) => {
          e.target.value = e.target.value.replace(/^0+/, "");
        }}
        className="w-14 text-center bg-gray-100 border border-gray-300 px-2 py-1"
      />
      <button
        onClick={() => onUpdate(value + 1)}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
};

export default QuantityInput;
