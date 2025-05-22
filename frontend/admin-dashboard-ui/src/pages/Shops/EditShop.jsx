import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { backendUrl } from "../../utils/auth";

const EditShop = () => {
  const [currentShop, setCurrentShop] = useState({});
  const [editing, setEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [dealers, setDealers] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/shops/${id}`)
      .then((response) => {
        setCurrentShop(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dealer:", error);
      });
    axios
      .get(`${backendUrl}/api/dealers`)
      .then((response) => {
        setDealers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shops:", error);
      });
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (event) => {
    setCurrentShop({
      ...currentShop,
      [event.target.name]: event.target.value,
    });
  };

  const handleDealerChange = (e) => {
    const dealerId = parseInt(e.target.value, 10);
    const selectedDealer = dealers.find((dealer) => dealer.ID === dealerId);

    if (selectedDealer) {
      setCurrentShop((prevShop) => ({
        ...prevShop,
        dealer_id: selectedDealer.ID,
        dealer_name: selectedDealer.first_name,
      }));
    }
  };

  const handleUpdateShop = () => {
    axios
      .put(`${backendUrl}/api/shops/${currentShop.ID}`, currentShop)
      .then((response) => {
        console.log(response.data);
        setEditing(false);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error updating dealer:", error);
      });
  };

  return (
    <div>
      <Link className="absolute btn btn-neutral" to="/dashboard/shops">
        Back
      </Link>
      <section className="w-full flex flex-col items-center justify-center h-100">
        <h2 className="text-2xl font-bold">Edit Shops</h2>
        <form className="flex w-[18rem] flex-col">
          <input
            type="text"
            name="name"
            value={currentShop.name}
            onChange={handleChange}
            className="input my-2"
            required
          />
          <select
            className="input my-2"
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
          <input
            type="text"
            name="location"
            value={currentShop.location}
            onChange={handleChange}
            className="input my-2"
            required
          />
           <input
            type="text"
            name="rating"
            value={currentShop.rating}
            onChange={handleChange}
            className="input my-2"
            required
          />
          <button className="btn btn-primary" onClick={handleUpdateShop}>
            Update
          </button>
        </form>
      </section>
    </div>
  );
};

export default EditShop;
