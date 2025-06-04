import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../utils/auth";

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
          axios.get(`${backendUrl}/api/car-models`),
          axios.get(`${backendUrl}/api/shops`),
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

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPart((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // Handle text input changes (for web)
  const handleImagePathChange = (e) => {
    setPart((prev) => ({
      ...prev,
      image: e.target.value,
    }));
  };

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("Submitting Part Data:", part); // Debugging

  //   try {
  //     await axios.post(`${backendUrl}/api/car-part`, part, {
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     console.log("Part created successfully:", part);
  //     setMessage("Part created successfully!");

  //     // Reset form
  //     setPart({
  //       name: "",
  //       image: null, //""
  //       size: "",
  //       price: "",
  //       condition: "",
  //       car_model_id: "",
  //       repair_shop_id: "",
  //     });
  //   } catch (error) {
  //     console.error("Error creating part:", error.response?.data || error);
  //     setMessage("Failed to create part.");
  //   }
  // };
  // Modified submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Append all part data to formData
      formData.append("name", part.name);
      formData.append("size", part.size);
      formData.append("price", part.price.toString());
      formData.append("condition", part.condition);
      formData.append("car_model_id", part.car_model_id.toString());
      formData.append("repair_shop_id", part.repair_shop_id.toString());

      // Handle image - either file or path
      if (part.image instanceof File) {
        formData.append("image", part.image);
      } else if (typeof part.image === "string") {
        formData.append("image", part.image);
      } else {
        throw new Error("Image is required");
      }

      const response = await axios.post(
        `${backendUrl}/api/car-part`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Part created successfully!");
      // Reset form
      setPart({
        name: "",
        image: null,
        size: "",
        price: "",
        condition: "",
        car_model_id: "",
        repair_shop_id: "",
      });
    } catch (error) {
      console.error("Error creating part:", error);
      setMessage(error.response?.data?.error || "Failed to create part.");
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
          {/* <span>
            <label className="block font-medium">Image</label>
            <input
              type="text"
              name="image"
              value={part.image}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </span> */}
          <div className="space-y-4">
            {/* Existing form fields... */}

            <div>
              <label className="block font-medium">Image</label>
              <div className="flex gap-4">
                {/* Option 1: File upload (for devices) */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Option 2: Text input (for web) */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or enter image URL
                  </label>
                  <input
                    type="text"
                    placeholder="http://example.com/image.jpg"
                    value={typeof part.image === "string" ? part.image : ""}
                    onChange={handleImagePathChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Image preview */}
              {part.image && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Preview:</p>
                  {part.image instanceof File ? (
                    <img
                      src={URL.createObjectURL(part.image)}
                      alt="Preview"
                      className="mt-1 h-20 object-contain border rounded"
                    />
                  ) : (
                    <img
                      src={part.image}
                      alt="Preview"
                      className="mt-1 h-20 object-contain border rounded"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Submit button and message... */}
          </div>
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
