import React, { useContext } from "react";
import { SharedStateContext } from "../../context/SharedStateContext";
import { IoHeartSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { wishlist, toggleWishlistItem } = useContext(SharedStateContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Wishlist Items</h1>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {wishlist.map((item) => (
            <div key={item.id} className="card">
              <section className="bg-white rounded-4xl relative shadow-md">
                <div className="text-orange-300 font-bold text-sm absolute top-4 left-4">
                  {item.condition}
                </div>
                {item.CarModel?.image_url && (
                  <div className="w-8 flex justify-center absolute top-2 right-4 items-center">
                    <img
                      src={item.CarModel.image_url}
                      alt=""
                      className="rounded-full ring ring-gray-300"
                    />
                  </div>
                )}
                <div className="flex justify-center rounded-4xl items-center pt-4">
                  <img
                    src={item.image}
                    className="object-center w-[11rem] object-cover"
                    alt={item.name}
                  />
                </div>
              </section>
              <div className="p-2 flex justify-between">
                <span className="relative">
                  <h2 className="card-title text-base font-semibold">
                    {item.name}
                  </h2>
                  <p className="text-gray-700 text-sm">
                    UGX&nbsp;
                    <span className="font-semibold">{item.price}</span>
                  </p>
                </span>
                <span className="flex flex-col items-end">
                  <button onClick={() => toggleWishlistItem(item)}>
                    <IoHeartSharp />
                  </button>
                  <p className="text-xs">Remove from wishlist</p>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600">
          <p className="mb-4">Your wishlist is empty.</p>
          <Link to="/" className="text-blue-500 hover:underline">
            Browse car parts
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
