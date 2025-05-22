import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { backendUrl } from "../../utils/auth";

const EditPart = () => {
  const [currentPart, setCurrentPart] = useState({});
  const [editing, setEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/car-part/${id}`)
      .then((response) => {
        setCurrentPart(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching part:", error);
      });
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (event) => {
    setCurrentPart({
      ...currentPart,
      [event.target.name]: event.target.value,
    });
    console.log(currentPart);
  };

  const handleUpdatePart = () => {
    axios
      .put(`${backendUrl}/api/car-part/${currentPart.ID}`, currentPart)
      .then((response) => {
        console.log(response.data);
        setEditing(false);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error updating dealer:", error);
      });
  };

  return (
    <div>
      <Link className="absolute btn btn-neutral" to="/dashboard/car-parts">
        Back
      </Link>
      <section className="w-full flex flex-col items-center justify-center h-100">
        <h2 className="text-2xl font-bold">Edit Brands</h2>
        <form>
          <div className="mb-3">
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={currentPart.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium">Image</label>
            <input
              type="text"
              name="image"
              value={currentPart.image}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium">Size</label>
            <input
              type="text"
              name="size"
              value={currentPart.size}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={currentPart.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium">Condition</label>
            <input
              type="text"
              name="condition"
              value={currentPart.condition}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button className="btn btn-primary" onClick={handleUpdatePart}>
            Update
          </button>
        </form>
      </section>
    </div>
  );
};

export default EditPart;
