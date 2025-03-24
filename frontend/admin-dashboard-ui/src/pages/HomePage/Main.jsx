import { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [carParts, setCarParts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/car-parts") // Fetch data
      .then((response) => {
        setCarParts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching car parts:", error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Car Parts</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {carParts.map((part, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-lg">
            <img
              src={part.image}
              alt={part.name}
              className="w-full h-40 object-cover mb-2"
            />
            <h2 className="text-lg font-semibold">{part.name}</h2>
            <p className="text-gray-700">${part.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
