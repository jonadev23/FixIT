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
    <div className="container  mx-auto px-4 ">
      <h1 className="font-bold text-center p-2 text-2xl">
        Find the parts you are looking for
      </h1>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam assumenda
        enim eius officiis eligendi est reiciendis, ipsa deserunt na
      </p>
      <div className="grid p-2 grid-cols-1 md:grid-cols-4 gap-4">
        {carParts.map((part, index) => (
          <div key={index} className=" bg-white card rounded-lg shadow-lg">
            <div className="flex justify-center pt-2 items-center">
              <figure className="  w-36 h-36">
                <img src={part.image} alt={part.name} />
              </figure>
            </div>

            <div className="card-body">
              <h2 className="card-title text-base font-semibold">
                {part.name}
              </h2>
              <p className="text-gray-700">UGX&nbsp;{part.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
