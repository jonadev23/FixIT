import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../utils/auth";
import Lottie from "lottie-react";
import spinnerJson from "../../assets/lotties/spinner.json";

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
  const [loading, setLoading] = useState(false);
  // getting all brands
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/car-brands`)
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
  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setModel((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // Handle text input changes (for web)
  const handleImagePathChange = (e) => {
    setModel((prev) => ({
      ...prev,
      image: e.target.value,
    }));
  };
  // Update handleSubmit to ensure correct payload
  const handleSubmit = async (e) => {
    setLoading(!loading);
    e.preventDefault();
    try {
      // Convert remaining string numbers to actual numbers
      const formData = new FormData();

      // Append all model data to formData
      formData.append("name", model.name);
      formData.append("make", model.size);
      formData.append("price", model.price.toString());
      formData.append("condition", model.condition);
      formData.append("year", model.year);
      formData.append("brand_id", model.brand_id.toString());
      formData.append("brand_name", model.brand_name);
      formData.append("image_url", model.image_url);

      // Handle image - either file or path
      if (model.image instanceof File) {
        formData.append("image", model.image);
      } else if (typeof model.image === "string") {
        formData.append("image", model.image);
      } else {
        throw new Error("Image is required");
      }

      // const payload = {
      //   ...model,
      //   price: parseFloat(model.price),
      //   brand_id: parseInt(model.brand_id, 10),
      // };

      const response = await axios.post(
        `${backendUrl}/api/car-model-sale`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Model created successfully!");
      setLoading(false);
      // Reset form
      setModel({
        name: "",
        make: "",
        image: null,
        price: "",
        condition: "",
        year: "",
        brand_id: "",
        brand_name: "",
        image_url: "",
      });
    } catch (error) {
      console.error("Error creating model:", error.response.data);
      setMessage("Failed to create model.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 bg-white shadow-sm rounded-xl">
      <h2 className="text-2xl font-bold mb-5 text-center">Create model</h2>
      {message && <p className="text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <span className="flex justify-between  gap-4">
          <div className="mb-3 w-full">
            <label className="block font-medium text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={model.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-3 w-full">
            <label className="block font-medium text-sm">Make</label>
            <input
              type="text"
              name="make"
              value={model.make}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </span>

        <span className="flex justify-between">
          <div className="space-y-4">
            {/* Existing form fields... */}

            <div>
              <div className="flex gap-4">
                {/* Option 1: File upload (for devices) */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-sm text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-sm text-gray-700 mb-1">
                    Or enter image URL
                  </label>
                  <input
                    type="text"
                    placeholder="http://example.com/image.jpg"
                    value={typeof model.image === "string" ? model.image : ""}
                    onChange={handleImagePathChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Image preview */}
              {model.image && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-sm">Preview:</p>
                  {model.image instanceof File ? (
                    <img
                      src={URL.createObjectURL(model.image)}
                      alt="Preview"
                      className="mt-1 h-20 object-contain border rounded"
                    />
                  ) : (
                    <img
                      src={model.image}
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
        </span>
        <div className="mb-3">
          <label className="block font-medium text-sm">Price</label>
          <input
            type="number"
            name="price"
            value={model.price}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <span className="flex gap-4 justify-between">
          <div className="mb-3 w-full">
            <label className="block font-medium text-sm">Condition</label>
            <input
              type="text"
              name="condition"
              value={model.condition}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-3 w-full">
            <label className="block font-medium text-sm">Year</label>
            <input
              type="text"
              name="year"
              value={model.year}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </span>

        <span className="flex justify-between gap-4">
          {" "}
          <div className="mb-3 w-full">
            <label className="block font-medium text-sm">Logo</label>
            <select
              name="image_url"
              value={model.image_url}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select an image</option>
              <option>Honda.jpg</option>
              <option>Mazda.jpg</option>
              <option>Toyota.jpg</option>
              <option>Subaru.jpg</option>
              <option>Mercedes.jpg</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="mb-3 w-full">
            <label className="block font-medium text-sm">Car Brand</label>
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
        </span>

        <div className="cursor-not-allowed">
          {" "}
          <button
            type="submit"
            className={
              loading
                ? "pointer-events-none rounded bg-black w-full flex justify-center text-center "
                : `cursor-pointer bg-black hover:bg-black/80 transition-colors duration-200 text-white p-2 rounded w-full`
            }
          >
            {loading ? (
              <div className="">
                {" "}
                <Lottie
                  animationData={spinnerJson}
                  loop
                  autoplay
                  style={{ width: 40, height: 40 }}
                />
              </div>
            ) : (
              <>Create Car</>
            )}{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateModel;
