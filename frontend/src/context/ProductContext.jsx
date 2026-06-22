import React, { createContext, useState, useEffect, useCallback } from 'react';
import API from '../utils/api';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sortMode, setSortMode] = useState('');

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/products';
      const params = [];
      if (searchKeyword) params.push(`keyword=${encodeURIComponent(searchKeyword)}`);
      if (activeCategory) params.push(`category=${encodeURIComponent(activeCategory)}`);
      if (sortMode) params.push(`sort=${encodeURIComponent(sortMode)}`);

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const { data } = await API.get(url);
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching products:', error.message);
    }
  }, [searchKeyword, activeCategory, sortMode]);

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProductDetails = async (id) => {
    try {
      const { data } = await API.get(`/products/${id}`);
      return { success: true, product: data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch details',
      };
    }
  };

  const createProductReview = async (id, reviewData) => {
    try {
      await API.post(`/products/${id}/reviews`, reviewData);
      fetchProducts(); // Refresh listings
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to add review',
      };
    }
  };

  // Admin: Create product
  const createProduct = async (productData) => {
    try {
      const { data } = await API.post('/products', productData);
      fetchProducts();
      return { success: true, product: data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create product',
      };
    }
  };

  // Admin: Update product
  const updateProduct = async (id, productData) => {
    try {
      const { data } = await API.put(`/products/${id}`, productData);
      fetchProducts();
      return { success: true, product: data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to update product',
      };
    }
  };

  // Admin: Delete product
  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete product',
      };
    }
  };

  // Admin: Category Operations
  const createCategory = async (categoryData) => {
    try {
      await API.post('/categories', categoryData);
      fetchCategories();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create category',
      };
    }
  };

  const deleteCategory = async (id) => {
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to delete category',
      };
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        searchKeyword,
        setSearchKeyword,
        activeCategory,
        setActiveCategory,
        sortMode,
        setSortMode,
        fetchProducts,
        getProductDetails,
        createProductReview,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        deleteCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
