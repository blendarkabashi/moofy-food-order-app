import { configureStore, createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    cart: [],
    view: 1,
    user: {
      fullName: "",
      email: "",
      phone: "",
      additionalNote: "",
    },
    numberOfPeople: 0,
    checkinDate: "",
    includeCleanupService: false,
    includeCleanupDishware: false,
  },
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setNumberOfPeople: (state, action) => {
      state.numberOfPeople = action.payload;
    },
    setCheckinDate: (state, action) => {
      state.checkinDate = action.payload;
    },
    toggleCleanupService: (state) => {
      state.includeCleanupService = !state.includeCleanupService;
    },
    toggleCleanupDishware: (state) => {
      state.includeCleanupDishware = !state.includeCleanupDishware;
    },
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setView: (state, action) => {
      state.view = action.payload;
    },
    updateQuantity: (state, action) => {
      const { item, newQuantity, mealId, dayId, isAddon } = action.payload;

      if (newQuantity < 0) return;

      const itemToUpdate = state.cart.find(
        (cartItem) => cartItem.itemId === item.id
      );
      if (newQuantity === 0 && itemToUpdate) {
        state.cart = state.cart.filter(
          (cartItem) => cartItem.itemId !== item.id
        );
        return;
      }

      if (itemToUpdate) {
        itemToUpdate.quantity = newQuantity;
      } else {
        const newCartItem = {
          dayId: dayId,
          mealId: mealId,
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: newQuantity,
          description: item.description ?? null,
          isAddon: isAddon,
        };
        state.cart.push(newCartItem);
      }
    },
    removeItem: (state, action) => {
      const { item } = action.payload;

      state.cart = state.cart.filter(
        (cartItem) =>
          !(
            cartItem.dayId === item.dayId &&
            cartItem.mealId === item.mealId &&
            cartItem.itemId === item.itemId &&
            cartItem.name === item.name
          )
      );
    },
  },
});

export const {
  setUser,
  setNumberOfPeople,
  setCheckinDate,
  toggleCleanupService,
  toggleCleanupDishware,
  addToCart,
  removeFromCart,
  clearCart,
  setView,
  setCart,
  updateQuantity,
  removeItem,
} = orderSlice.actions;

const store = configureStore({
  reducer: {
    order: orderSlice.reducer,
  },
});

export default store;
