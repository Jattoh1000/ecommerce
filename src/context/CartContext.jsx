// src/context/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

const cartReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.selectedColor === action.payload.selectedColor &&
          item.selectedSize === action.payload.selectedSize,
      );

      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id &&
            item.selectedColor === action.payload.selectedColor &&
            item.selectedSize === action.payload.selectedSize
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
        toast.success("Item quantity updated!", {
          id: "add_to_cart_toast",
          name_id: "add_to_cart_toast",
          duration: 2000,
        });
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
        toast.success("Product added to cart!", {
          id: "add_to_cart_toast",
          name_id: "add_to_cart_toast",
          duration: 2000,
        });
      }
      break;

    case "REMOVE_FROM_CART":
      newState = {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
      toast.success("Product removed from cart!", {
        id: "remove_from_cart_toast",
        name_id: "remove_from_cart_toast",
        duration: 2000,
      });
      break;

    case "UPDATE_QUANTITY":
      newState = {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };
      break;

    case "CLEAR_CART":
      newState = {
        ...state,
        items: [],
      };
      break;

    default:
      return state;
  }

  localStorage.setItem("cart", JSON.stringify(newState));
  return newState;
};

const getInitialState = () => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    const parsed = JSON.parse(savedCart);
    return { items: parsed.items || [] };
  }
  return { items: [] };
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  const addToCart = (
    product,
    selectedColor = "Default",
    selectedSize = "Standard",
  ) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, selectedColor, selectedSize },
    });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const cartCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = state.items.reduce((total, item) => {
    const price = item.discount_price || item.price;
    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        cartCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
