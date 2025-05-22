import { useState, useEffect } from "react";
import axios from "axios";

const CreateModel = () => {
  // Update your state initialization to use correct types
  const [model, setModel] = useState({
    name: "",
    make: "",
    image: "",
    price: 0, // Initialize as number
    condition: "",
    year: "",
    brand_id: 0, // Initialize as number
    brand_name: "",
    image_url: "",
  });

  const [brands, setBrands] = useState([]);
  const [message, setMessage] = useState("");
  // getting all brands
  useEffect(() => {
    axios
      .get("https://starlit-wisp-63c85a.netlify.app/api/car-brands")
      .then((response) => {
        setBrands(response.data);
      })
      .catch((error) => {
        console.error("Error fetching models:", error);
      });
  }, [model]);

  const handleBrandChange = (e) => {
    const brandId = parseInt(e.target.value, 10);
    const selectedBrand = brands.find((brand) => brand.ID === brandId);

    if (selectedBrand) {
      setModel((prevmodel) => ({
        ...prevmodel,
        brand_id: selectedBrand.ID,
        brand_name: selectedBrand.name,
      }));
    }
  };

  // Update handleChange to handle numeric fields
  const handleChange = (e) => {
    const value =
      e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;

    setModel({ ...model, [e.target.name]: value });
  };
 // Update handleSubmit to ensure correct payload
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Convert remaining string numbers to actual numbers
    const payload = {
      ...model,
      price: parseFloat(model.price),
      brand_id: parseInt(model.brand_id, 10)
    };
    
    const response = await axios.post(
      "https://starlit-wisp-63c85a.netlify.app/api/car-model",
      payload
    );
    setMessage("Model created successfully!");
  } catch (error) {
    console.error("Error creating model:", error);
    setMessage("Failed to create model.");
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-5">Create model</h2>
      {message && <p className="text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={model.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium">Make</label>
          <input
            type="text"
            name="make"
            value={model.make}
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
            value={model.image}
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
            value={model.price}
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
            value={model.condition}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium">Year</label>
          <input
            type="text"
            name="year"
            value={model.year}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium">Logo</label>
          <input
            type="text"
            name="image_url"
            value={model.image_url}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium">Car Brand</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            name="brand_id" // Ensure this name matches the backend field expecting the ID
            onChange={handleBrandChange} // Update state on selection
          >
            <option value="">--Select Name--</option>
            {brands.map((brand) => (
              <option key={brand.ID} value={brand.ID}>
                {brand.name}{" "}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Create model
        </button>
      </form>
    </div>
  );
};

export default CreateModel;
