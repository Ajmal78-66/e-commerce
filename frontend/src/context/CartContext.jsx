import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // Pricing summaries
  const [prices, setPrices] = useState({
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  });

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Sync cart and recalculate prices whenever cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    // Free shipping above $500, otherwise $50 shipping fee
    const shippingPrice = itemsPrice === 0 ? 0 : itemsPrice > 500 ? 0 : 50;
    // 8% tax rate
    const taxPrice = itemsPrice * 0.08;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    setPrices({
      itemsPrice: Number(itemsPrice.toFixed(2)),
      shippingPrice: Number(shippingPrice.toFixed(2)),
      taxPrice: Number(taxPrice.toFixed(2)),
      totalPrice: Number(totalPrice.toFixed(2)),
    });
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product._id);
      if (existItem) {
        return prevItems.map((x) =>
          x.product === product._id ? { ...x, qty: Math.min(x.countInStock, x.qty + qty) } : x
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty,
          },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== id));
  };

  const updateCartQty = (id, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((x) => (x.product === id ? { ...x, qty: Number(qty) } : x))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        prices,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
