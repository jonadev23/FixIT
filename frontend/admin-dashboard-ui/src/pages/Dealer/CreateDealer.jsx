import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../../utils/auth";
import Lottie from "lottie-react";
import spinnerJson from "../../assets/lotties/spinner.json";

const CreateDealer = () => {
  const [dealer, setDealer] = useState({
    name: "",
    email: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setDealer({ ...dealer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(!loading);
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/dealers`, dealer);
      setMessage("Dealer created successfully!");
      setLoading(false);
      //   setDealer({ first_name: "",last_name:"", email: "", contact: "" });
    } catch (error) {
      console.error("Error creating dealer:", error);
      setMessage("Failed to create dealer.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-sm rounded">
      <h2 className="text-2xl font-bold mb-5">Create Dealer</h2>

      {message && <p className="text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block font-medium text-sm">First Name</label>
          <input
            type="text"
            name="first_name"
            value={dealer.first_name}
            onChange={handleChange}
            className="w-full p-2 border text-sm border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium text-sm">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={dealer.last_name}
            onChange={handleChange}
            className="w-full p-2 border text-sm border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={dealer.email}
            onChange={handleChange}
            className="w-full p-2 border text-sm border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block font-medium text-sm">Contact</label>
          <input
            type="text"
            name="number"
            value={dealer.number}
            onChange={handleChange}
            className="w-full p-2 border text-sm border-gray-300 rounded"
            required
          />
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
              <>Create Dealer</>
            )}{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDealer;
