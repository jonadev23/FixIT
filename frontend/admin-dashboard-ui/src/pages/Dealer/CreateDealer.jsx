import { useState } from "react";
import axios from "axios";

const CreateDealer = () => {
  const [dealer, setDealer] = useState({
    name: "",
    email: "",
    contact: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setDealer({ ...dealer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/dealers", dealer);
      setMessage("Dealer created successfully!");
    //   setDealer({ first_name: "",last_name:"", email: "", contact: "" });
    } catch (error) {
      console.error("Error creating dealer:", error);
      setMessage("Failed to create dealer.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-5">Create Dealer</h2>
      {message && <p className="text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block font-medium">First Name</label>
          <input
            type="text"
            name="first_name"
            value={dealer.first_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={dealer.last_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={dealer.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium">Contact</label>
          <input
            type="text"
            name="number"
            value={dealer.number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Create Dealer
        </button>
      </form>
    </div>
  );
};

export default CreateDealer;
