import React, { useState, useEffect } from "react";
import axios from "axios";

const Shops = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/shops")
      .then((response) => {
        setShops(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shops:", error);
      });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold">Shops</h2>
      <ul>
        {shops.map((dealer) => (
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Dealer</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop.ID} className="p-2 border-b border-gray-300">
                  <td>{shop.ID}</td>
                  <td>{shop.name}</td>
                  <td>{shop.dealer_name}</td>
                  <td>{shop.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </ul>
    </div>
  );
};

export default Shops;
