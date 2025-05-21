import React, { createContext, useState, useEffect } from "react";

export const SharedStateContext = createContext();

export const SharedStateProvider = ({ children }) => {
  // Load wishlist from localStorage on initial render
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Check if an item is in the wishlist
  const isInWishlist = (itemId) => {
    return wishlist.some((item) => item.id === itemId);
  };

  // Toggle an item in the wishlist
  const toggleWishlistItem = (item) => {
    if (isInWishlist(item.id)) {
      // Remove item from wishlist
      setWishlist(
        wishlist.filter((wishlistItem) => wishlistItem.id !== item.id)
      );
    } else {
      // Add item to wishlist
      setWishlist([...wishlist, item]);
    }
  };

  return (
    <SharedStateContext.Provider
      value={{
        wishlist,
        toggleWishlistItem,
        isInWishlist,
      }}
    >
      {children}
    </SharedStateContext.Provider>
  );
};
