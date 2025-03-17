import { useState } from "react";
import axios from "axios";

const CreateBrand = () => {
  const [brand, setBrand] = useState({
    name: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setBrand({ ...brand, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/car-brand",
        brand
      );
      setMessage("brand created successfully!");
    } catch (error) {
      console.error("Error creating brand:", error);
      setMessage("Failed to create brand.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-5">Create brand</h2>
      {message && <p className="text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={brand.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Create brand
        </button>
      </form>
    </div>
  );
};

export default CreateBrand;
