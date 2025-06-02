import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { backendUrl } from "../../utils/auth";

const Models = () => {
  const [models, setmodels] = useState([]);
  const navigate = useNavigate();
  // getting all models
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/car-model-sale`)
      .then((response) => {
        setmodels(response.data);
      })
      .catch((error) => {
        console.error("Error fetching models:", error);
      });
  }, []);


  // deleting a model
  const handleConfirmDelete = (id) => {
    axios
      .delete(`${backendUrl}/api/car-model-sale/${id}`)
      .then((response) => {
        setmodels(models.filter((model) => model.id !== id));
        navigate('/dashboard/car-models');
      })
      .catch((error) => {
        console.error("Error deleting model:", error);
      });
  };


  return (
    <div>
      <h2 className="text-2xl font-bold">Models</h2>
      <Link to="/dashboard/create-model-sale">
        <button className="btn btn-neutral my-4">Create</button>
      </Link>

      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Make</th>
            <th>Image</th>
            <th>Price</th>
            <th>Condition</th>
            <th>Year</th>
            <th>Brand Name</th>
            <th>Logo Url</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr key={model.ID} className="p-2 border-b border-gray-300">
              <td>{model.ID}</td>
              <td>{model.name}</td>
              <td>{model.make}</td>
              <td>{model.image}</td>
              <td>{model.price}</td>
              <td>{model.condition}</td>
              <td>{model.year}</td>
              <td>{model.brand_name}</td>
              <td>{model.image_url}</td>
              <td>
                <Link to={`/dashboard/edit-model/${model.ID}`}>
                  <button className="btn btn-primary mx-4">Edit</button>
                </Link>
                <button
                  onClick={() => handleConfirmDelete(model.ID)}
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

export default Models;
