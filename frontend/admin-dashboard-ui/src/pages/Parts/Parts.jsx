import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { backendUrl } from "../../utils/auth";

const Parts = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/car-parts`)
      .then((response) => {
        setBrands(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching parts:", error);
      });
  }, []);

  // deleting a brand
  const handleConfirmDelete = (id) => {
    axios
      .delete(`${backendUrl}/api/car-part/${id}`)
      .then((response) => {
        console.log(response.data);
        setBrands(brands.filter((brand) => brand.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting brand:", error);
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Car Parts</h2>
      <Link to="/dashboard/create-part">
        <button className="btn btn-neutral my-4">Create</button>
      </Link>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Image</th>
            <th>Size</th>
            <th>Price</th>
            <th>Condition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand, index) => (
            <tr key={brand.ID} className="p-2 border-b border-gray-300">
              <th>{index + 1}</th>
              <td>{brand.name}</td>
              <td>{brand.image}</td>
              <td>{brand.size}</td>
              <td>{brand.price}</td>
              <td>{brand.condition}</td>

              <td>
                <Link to={`/dashboard/edit-part/${brand.ID}`}>
                  <button className="btn btn-primary mx-4">Edit</button>
                </Link>
                <button
                  onClick={() => handleConfirmDelete(brand.ID)}
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

export default Parts;
