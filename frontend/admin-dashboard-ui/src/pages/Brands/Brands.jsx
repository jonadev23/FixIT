import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Brands = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios
      .get("https://starlit-wisp-63c85a.netlify.app/api/car-brands")
      .then((response) => {
        setBrands(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  // deleting a brand
  const handleConfirmDelete = (id) => {
    axios
      .delete(`https://starlit-wisp-63c85a.netlify.app/api/car-brand/${id}`)
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
      <h2 className="text-2xl font-bold">Car Brands</h2>
      <Link to="/dashboard/create-brand">
        <button className="btn btn-neutral my-4">Create</button>
      </Link>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand, index) => (
            <tr key={brand.ID} className="p-2 border-b border-gray-300">
              <th>{index + 1}</th>
              <td>{brand.name}</td>

              <td>
                <Link to={`/dashboard/edit-brand/${brand.ID}`}>
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

export default Brands;
