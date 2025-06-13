import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../utils/auth";
import Lottie from "lottie-react";
import spinnerJson from "../../assets/lotties/spinner.json";

const CreateShop = () => {
  const [shop, setShop] = useState({
    name: "",
    location: "",
    dealer_id: "",
    dealer_name: "",
    dealer_contact: "",
    rating: 0,
  });
  const [dealers, setDealers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // getting all dealers
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/dealers`)
      .then((response) => {
        setDealers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shops:", error);
      });
  }, [shop]);

  const handleDealerChange = (e) => {
    const dealerId = parseInt(e.target.value, 10);
    const selectedDealer = dealers.find((dealer) => dealer.ID === dealerId);

    if (selectedDealer) {
      setShop((prevShop) => ({
        ...prevShop,
        dealer_id: selectedDealer.ID,
        dealer_name: selectedDealer.first_name,
        dealer_contact: selectedDealer.number,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field being changed is "rating"
    if (name === "rating") {
      // Convert to number if it's not empty, otherwise keep as empty string
      // You could also default to 0 or null instead of empty string
      const numericValue = value === "" ? "" : Number(value);
      // Validate range
      if (numericValue < 0) {
        setError("Minimum value is 0");
        setShop({
          ...shop,
          [name]: !isNaN(numericValue) ? numericValue : 0, // Changed shop.rating to 0
        });
      } else if (numericValue > 5) {
        setError("Maximum value is 5");
        setShop({
          ...shop,
          [name]: !isNaN(numericValue) ? numericValue : 5, // Changed shop.rating to 5
        });
      } else {
        setError("");
        setShop({
          ...shop,
          [name]: !isNaN(numericValue) ? numericValue : shop.rating,
        });
      }
    } else {
      // For non-rating fields, update normally
      setShop({
        ...shop,
        [name]: value,
      });
    }
  };

  const handleBlur = () => {
    // Ensure value is set properly when leaving the field
    if (value === "") {
      setValue(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/shops`, shop);
      setMessage("shop created successfully!");
    } catch (error) {
      console.error("Error creating shop:", error);
      setMessage("Failed to create shop.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-5">Create Shop</h2>
      {message && <p className="text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block font-medium text-sm">Name</label>
          <input
            type="text"
            name="name"
            value={shop.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium text-sm">Dealer</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            name="dealer_id" // Ensure this name matches the backend field expecting the ID
            onChange={handleDealerChange} // Update state on selection
          >
            <option value="">--Select Name--</option>
            {dealers.map((dealer) => (
              <option key={dealer.ID} value={dealer.ID}>
                {dealer.first_name}{" "}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block font-medium text-sm">Location</label>
          <input
            type="text"
            name="location"
            value={shop.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium text-sm">Rating</label>
          <input
            type="number"
            name="rating"
            value={shop.rating}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

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
              <>Create Shop</>
            )}{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateShop;
