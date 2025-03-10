import { useEffect, useState } from "react";

export default function FoodOrderForm({ menuState, cart, setCart }) {
  const [mealSelected, setMealSelected] = useState([]);

  const updateQuantity = (dayId, mealId, item, isAddon, newQuantity) => {
    if (newQuantity < 0) return;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.dayId === dayId &&
          cartItem.mealId === mealId &&
          cartItem.itemId === item.id &&
          cartItem.isAddon === isAddon
      );

      if (newQuantity === 0) {
        return existingItemIndex !== -1
          ? prevCart.filter((_, index) => index !== existingItemIndex)
          : prevCart;
      }

      const cartItem = {
        dayId,
        mealId,
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: newQuantity,
        isAddon,
      };

      if (existingItemIndex !== -1) {
        return prevCart.map((item, index) =>
          index === existingItemIndex ? cartItem : item
        );
      }

      return [...prevCart, cartItem];
    });
  };

  const getItemQuantity = (dayId, mealId, itemId, isAddon) => {
    const cartItem = cart.find(
      (item) =>
        item.dayId === dayId &&
        item.mealId === mealId &&
        item.itemId === itemId &&
        item.isAddon === isAddon
    );
    return cartItem?.quantity || 0;
  };

  const isMealSelected = (meal) => {
    return mealSelected.some(
      (selected) =>
        selected.dayId === meal.day_id && selected.mealId === meal.id
    );
  };

  useEffect(() => {
    console.log("Cart:", cart);
  }, [cart]);

  return (
    <div className="w-full space-y-6 text-black">
      {menuState.map((day) => (
        <div
          key={day.id}
          className="bg-white p-6 border border-gray-200 rounded-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">
            {day.name.toUpperCase()}
          </h2>

          {day.meals.map((meal) => (
            <div key={meal.id} className="mb-6">
              <label className="flex items-center mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMealSelected(meal)}
                  onChange={() => {
                    setMealSelected((prevState) => {
                      const mealIdentifier = {
                        dayId: meal.day_id,
                        mealId: meal.id,
                      };
                      return prevState.some(
                        (selected) =>
                          selected.dayId === mealIdentifier.dayId &&
                          selected.mealId === mealIdentifier.mealId
                      )
                        ? prevState.filter(
                            (selected) =>
                              selected.dayId !== mealIdentifier.dayId ||
                              selected.mealId !== mealIdentifier.mealId
                          )
                        : [...prevState, mealIdentifier];
                    });
                  }}
                  className="mr-2 w-5 h-5"
                />
                <h3 className="text-lg font-semibold">
                  {meal.type.toUpperCase()} - {meal.restaurant}
                </h3>
              </label>

              {isMealSelected(meal) && (
                <div className="space-y-3">
                  {meal.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <span className="text-gray-800 font-medium">
                          {item.name}
                        </span>
                        {item.description && (
                          <p className="text-gray-500 text-sm">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-6">
                          ${item.price.toFixed(2)}
                        </span>
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              updateQuantity(
                                meal.day_id,
                                meal.id,
                                item,
                                false,
                                getItemQuantity(
                                  meal.day_id,
                                  meal.id,
                                  item.id,
                                  false
                                ) - 1
                              )
                            }
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={getItemQuantity(
                              meal.day_id,
                              meal.id,
                              item.id,
                              false
                            )}
                            onChange={(e) =>
                              updateQuantity(
                                meal.day_id,
                                meal.id,
                                item,
                                false,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-14 text-center bg-gray-100 border border-gray-300 px-2 py-1"
                          />
                          <button
                            onClick={() =>
                              updateQuantity(
                                meal.day_id,
                                meal.id,
                                item,
                                false,
                                getItemQuantity(
                                  meal.day_id,
                                  meal.id,
                                  item.id,
                                  false
                                ) + 1
                              )
                            }
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {meal.addons?.length > 0 && (
                    <div className="mt-3 ml-6 p-3 bg-gray-50 border-l-4 border-blue-400 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-400">
                        Add-ons
                      </h4>
                      {meal.addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex justify-between items-center text-gray-600 mt-1"
                        >
                          <span>➕ {addon.name}</span>
                          <div className="flex items-center">
                            <span className="font-medium mr-6">
                              ${addon.price.toFixed(2)}
                            </span>
                            <div className="flex items-center">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    meal.day_id,
                                    meal.id,
                                    addon,
                                    true,
                                    getItemQuantity(
                                      meal.day_id,
                                      meal.id,
                                      addon.id,
                                      true
                                    ) - 1
                                  )
                                }
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={getItemQuantity(
                                  meal.day_id,
                                  meal.id,
                                  addon.id,
                                  true
                                )}
                                min="0"
                                onChange={(e) =>
                                  updateQuantity(
                                    meal.day_id,
                                    meal.id,
                                    addon,
                                    true,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-14 text-center bg-gray-100 border border-gray-300 px-2 py-1"
                              />
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    meal.day_id,
                                    meal.id,
                                    addon,
                                    true,
                                    getItemQuantity(
                                      meal.day_id,
                                      meal.id,
                                      addon.id,
                                      true
                                    ) + 1
                                  )
                                }
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
