import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await API.get('/wishlist');
      setWishlistItems(data.products || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching wishlist:', error.message);
    }
  };

  // Sync wishlist when user logins or updates
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) return { success: false, message: 'Please login to use wishlist' };
    
    const productId = product._id;
    const exists = wishlistItems.some((item) => item._id === productId);

    try {
      if (exists) {
        // Remove
        const { data } = await API.delete(`/wishlist/${productId}`);
        setWishlistItems(data.products || []);
        return { success: true, added: false };
      } else {
        // Add
        const { data } = await API.post(`/wishlist/${productId}`);
        setWishlistItems(data.products || []);
        return { success: true, added: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update wishlist',
      };
    }
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        toggleWishlist,
        isWishlisted,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
