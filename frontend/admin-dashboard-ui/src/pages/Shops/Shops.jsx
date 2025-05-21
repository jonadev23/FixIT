import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Shops = () => {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();
  // getting all shops
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/shops")
      .then((response) => {
        setShops(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shops:", error);
      });
  }, []);

  // deleting a shop
  const handleConfirmDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/shops/${id}`)
      .then((response) => {
        setShops(shops.filter((shop) => shop.id !== id));
        navigate('/dashboard/shops');
      })
      .catch((error) => {
        console.error("Error deleting shop:", error);
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Shops</h2>
      <Link to="/dashboard/create-shop">
        <button className="btn btn-neutral my-4">Create</button>
      </Link>

      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Dealer</th>
            <th>Location</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((shop) => (
            <tr key={shop.ID} className="p-2 border-b border-gray-300">
              <td>{shop.ID}</td>
              <td>{shop.name}</td>
              <td>{shop.dealer_name}</td>
              <td>{shop.location}</td>
              <td>{shop.rating}</td>
              <td>
                <Link to={`/dashboard/edit-shop/${shop.ID}`}>
                  <button className="btn btn-primary mx-4">Edit</button>
                </Link>
                <button
                  onClick={() => handleConfirmDelete(shop.ID)}
                  className="btn btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Shops;
