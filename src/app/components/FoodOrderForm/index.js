import { useEffect, useState } from "react";
import QuantityInput from "../shared/QuantityInput";
import CheckboxInput from "../shared/CheckboxInput";
import { menuData } from "@/app/data/globals";
import { useSelector, useDispatch } from "react-redux";
import { setCart, updateQuantity } from "@/app/store";

export default function FoodOrderForm() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.order.cart);
  const numberOfPeople = useSelector((state) => state.order.numberOfPeople);

  const [mealSelected, setMealSelected] = useState([]);

  const handleMealChange = (dayId, mealId, isChecked) => {
    if (!isChecked) {
      dispatch(
        setCart(
          cart.filter(
            (item) => !(item.dayId === dayId && item.mealId === mealId)
          )
        )
      );
    }
    setMealSelected((prevState) => {
      const mealIdentifier = { dayId, mealId };
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
  };
  useEffect(() => {
    if (!numberOfPeople || numberOfPeople < 1) return;
    let updatedCart = [...cart];

    mealSelected.forEach(({ dayId, mealId }) => {
      const selectedMeal = menuData
        .find((day) => day.id === dayId)
        ?.meals.find((meal) => meal.id === mealId);

      if (!selectedMeal) return;

      selectedMeal.items.forEach((item) => {
        const existingItemIndex = updatedCart.findIndex(
          (cartItem) => cartItem.itemId === item.id
        );

        const newCartItem = {
          dayId,
          mealId,
          itemId: item.id,
          name: item.name,
          price: item.price,
          description: item.description ?? null,
          quantity: numberOfPeople,
          isAddon: false,
        };

        if (existingItemIndex !== -1) {
          updatedCart[existingItemIndex] = newCartItem;
        } else {
          updatedCart.push(newCartItem);
        }
      });
    });
    dispatch(setCart(updatedCart));
  }, [numberOfPeople, mealSelected]);

  const isMealSelected = (meal) => {
    return mealSelected.some(
      (selected) =>
        selected.dayId === meal.day_id && selected.mealId === meal.id
    );
  };

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  return (
    <div className="w-full space-y-6 text-black">
      {menuData.map((day) => (
        <div
          key={day.id}
          className="bg-white p-6 border border-gray-200 rounded-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">
            {day.name.toUpperCase()}
          </h2>

          {day.meals.map((meal) => (
            <div key={meal.id} className="mb-6 last:mb-0">
              <div className="flex items-center">
                <CheckboxInput
                  checked={isMealSelected(meal)}
                  onChange={(e) =>
                    handleMealChange(meal.day_id, meal.id, e.target.checked)
                  }
                  className="mr-2 w-5 h-5 cursor-pointer"
                />
                <h3 className="text-lg font-semibold">
                  {meal.type.toUpperCase()} - {meal.restaurant}
                </h3>
              </div>

              {isMealSelected(meal) && (
                <div className="space-y-3">
                  {meal.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div className="pr-5">
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
                        {item.price == 0 ? (
                          <span className="font-medium pl-40 text-right">
                            Included
                          </span>
                        ) : (
                          <>
                            <span className="font-medium mr-6">
                              ${item.price.toFixed(2)}
                            </span>
                            <QuantityInput
                              onUpdate={(newQuantity) => {
                                dispatch(
                                  updateQuantity({
                                    item,
                                    newQuantity,
                                    mealId: meal.id,
                                    dayId: day.id,
                                    isAddon: true,
                                  })
                                );
                              }}
                              meal={meal}
                              item={item}
                              value={
                                cart.find(
                                  (cartItem) => cartItem.itemId === item.id
                                )?.quantity || 0
                              }
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {meal.addons?.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 border-l-4 border-blue-400 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-400">
                        Add-ons
                      </h4>
                      {meal.addons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex justify-between items-center text-gray-600 mt-1"
                        >
                          <span>{addon.name}</span>
                          <div className="flex items-center">
                            <span className="font-medium mr-6">
                              ${addon.price.toFixed(2)}
                            </span>
                            <QuantityInput
                              onUpdate={(newQuantity) =>
                                dispatch(
                                  updateQuantity({
                                    item: addon,
                                    newQuantity,
                                    mealId: meal.id,
                                    dayId: day.id,
                                    isAddon: true,
                                  })
                                )
                              }
                              meal={meal}
                              item={addon}
                              isAddon={true}
                              value={
                                cart.find(
                                  (cartItem) => cartItem.itemId === addon.id
                                )?.quantity || 0
                              }
                            />
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
