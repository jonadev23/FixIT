import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../../utils/auth";
import Lottie from "lottie-react";
import spinnerJson from "../../assets/lotties/spinner.json";

const CreateBrand = () => {
  const [brand, setBrand] = useState({
    name: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setBrand({ ...brand, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(!loading);
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/car-brand`, brand);
      setMessage("brand created successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error creating brand:", error);
      setMessage("Failed to create brand.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-5">Create brand</h2>
      {message && <p className="text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block font-medium text-sm">Name</label>
          <input
            type="text"
            name="name"
            value={brand.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
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
              <>Create Brand</>
            )}{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBrand;
