import { useState, useEffect } from "react";
import axios from "axios";

const CreateShop = () => {
  const [shop, setShop] = useState({
    name: "",
    location: "",
    dealer_id: "",
    dealer_name: "",
  });
  const [dealers, setDealers] = useState([]);
  const [message, setMessage] = useState("");
  // getting all dealers
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dealers")
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
      }));
    }
  };

  const handleChange = (e) => {
    setShop({ ...shop, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shops",
        shop
      );
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
          <label className="block font-medium">Name</label>
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
          <label className="block font-medium">Dealer</label>
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
          <label className="block font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={shop.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Create Shop
        </button>
      </form>
    </div>
  );
};

export default CreateShop;
