import { useState, useEffect } from "react";
import axios from "axios";

const CreatePart = () => {
  const [part, setPart] = useState({
    name: "",
    image: "",
    size: "",
    price: "",
    condition: "",
    car_model_id: "",
    repair_shop_id: "",
  });

  const [carModels, setCarModels] = useState([]);
  const [repairShops, setRepairShops] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch Car Models and Repair Shops on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carModelsRes, repairShopsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/car-models"),
          axios.get("http://localhost:5000/api/shops"),
        ]);
        setCarModels(carModelsRes.data);
        setRepairShops(repairShopsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPart((prevPart) => ({
      ...prevPart,
      [name]: name === "price" ? parseFloat(value) || 0 : value, // Convert price to number
    }));
  };

  const handleCarModelChange = (e) => {
    const selectedId = parseInt(e.target.value, 10); // Convert to integer
    setPart((prev) => ({
      ...prev,
      car_model_id: isNaN(selectedId) ? "" : selectedId, // Ensure it's a number or empty
    }));
  };

  const handleRepairShopChange = (e) => {
    const selectedId = parseInt(e.target.value, 10); // Convert to integer
    setPart((prev) => ({
      ...prev,
      repair_shop_id: isNaN(selectedId) ? "" : selectedId, // Ensure it's a number or empty
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Part Data:", part); // Debugging

    try {
      await axios.post("http://localhost:5000/api/car-part", part, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Part created successfully:", part);
      setMessage("Part created successfully!");

      // Reset form
      setPart({
        name: "",
        image: "",
        size: "",
        price: "",
        condition: "",
        car_model_id: "",
        repair_shop_id: "",
      });
    } catch (error) {
      console.error("Error creating part:", error.response?.data || error);
      setMessage("Failed to create part.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-5">Create Part</h2>
      {message && <p className="text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3 flex gap-2">
          <span>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={part.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </span>
          <span>
            <label className="block font-medium">Image</label>
            <input
              type="text"
              name="image"
              value={part.image}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </span>
        </div>

        <div className="mb-3 flex gap-2">
          <span>
            <label className="block font-medium">Size</label>
            <input
              type="text"
              name="size"
              value={part.size}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </span>

          <span>
            <label className="block font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={part.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </span>
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

        {/* Car Model Selection */}
        <div className="mb-3">
          <label className="block font-medium">Car Model</label>
          <select
            name="car_model_id"
            value={part.car_model_id}
            onChange={handleCarModelChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Car Model</option>
            {carModels.map((model) => (
              <option key={model.ID} value={model.ID}>
                {model.name} - {model.make} ({model.year})
              </option>
            ))}
          </select>
        </div>

        {/* Repair Shop Selection */}
        <div className="mb-3">
          <label className="block font-medium">Repair Shop</label>
          <select
            name="repair_shop_id"
            value={part.repair_shop_id}
            onChange={handleRepairShopChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Repair Shop</option>
            {repairShops.map((shop) => (
              <option key={shop.ID} value={shop.ID}>
                {shop.name} - {shop.location}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Create Part
        </button>
      </form>
    </div>
  );
};

export default CreatePart;
