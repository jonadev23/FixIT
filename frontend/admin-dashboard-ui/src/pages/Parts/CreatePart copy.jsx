import { useState } from "react";
import axios from "axios";

const CreatePart = () => {
  const [part, setPart] = useState({
    name: "",
    image: "",
    size: "",
    price: "",
    condition:"",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPart((prevPart) => ({
      ...prevPart,
      [name]: name === "price" ? parseFloat(value) || 0 : value, // Convert price to a number
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/car-part",
        part
      );
      setMessage("Part created successfully!");
    } catch (error) {
      console.error("Error creating part:", error);
      setMessage("Failed to create part.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-5">Create Part</h2>
      {message && <p className="text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={part.name}
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
            value={part.image}
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
            value={part.size}
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
            value={part.price}
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
            value={part.condition}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Create part
        </button>
      </form>
    </div>
  );
};

export default CreatePart;
