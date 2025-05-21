import { createContext, useState, useEffect } from "react";

export const SharedStateContext = createContext();

export const SharedStateProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlistItem = (item) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((i) => i.ID === item.ID);
      if (exists) {
        return prevWishlist.filter((i) => i.ID !== item.ID);
      } else {
        console.log("Added to wishlist");
        return [...prevWishlist, item];
      }
    });
  };

  const isInWishlist = (itemId) => {
    return wishlist.some((item) => item.ID === itemId);
  };

  return (
    <SharedStateContext.Provider
      value={{ wishlist, toggleWishlistItem, isInWishlist }}
    >
      {children}
    </SharedStateContext.Provider>
  );
};
