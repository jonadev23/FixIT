import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { backendUrl } from "../../utils/auth";

const EditModel = () => {
  const [currentModel, setCurrentModel] = useState({});
  const [editing, setEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/car-model/${id}`)
      .then((response) => {
        setCurrentModel(response.data);
      })
      .catch((error) => {
        console.error("Error fetching model:", error);
      });
    axios
      .get(`${backendUrl}/api/car-brands`)
      .then((response) => {
        setBrands(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (event) => {
    setCurrentModel({
      ...currentModel,
      [event.target.name]: event.target.value,
    });
  };

  const handleBrandChange = (e) => {
    const brandId = parseInt(e.target.value, 10);
    const selectedBrand = brands.find((brand) => brand.ID === brandId);

    if (selectedBrand) {
      setCurrentModel((prevmodel) => ({
        ...prevmodel,
        car_brand_id: selectedBrand.ID,
        brand_name: selectedBrand.name,
      }));
    }
  };

  const handleUpdateBrand = () => {
    axios
      .put(
        `${backendUrl}/api/car-model/${currentModel.ID}`,
        currentModel
      )
      .then((response) => {
        console.log(response.data);
        setEditing(false);
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error updating brand:", error);
      });
  };

  return (
    <div>
      <Link className="absolute btn btn-neutral" to="/dashboard/shops">
        Back
      </Link>
      <section className="w-full flex flex-col items-center justify-center h-100">
        <h2 className="text-2xl font-bold">Edit Models</h2>
        <form className="flex w-[18rem] flex-col">
          <input
            type="text"
            name="name"
            value={currentModel.name}
            onChange={handleChange}
            className="input my-2"
            required
          />
          <input
            type="text"
            name="make"
            value={currentModel.make}
            onChange={handleChange}
            className="input my-2"
            required
          />
          <input
            type="text"
            name="image"
            value={currentModel.image}
            onChange={handleChange}
            className="input my-2"
            required
          />
          <input
            type="text"
            name="price"
            value={currentModel.price}
            onChange={handleChange}
            className="input my-2"
            required
          />
          <input
            type="text"
            name="condition"
            value={currentModel.condition}
            onChange={handleChange}
            className="input my-2"
            required
          />
          <input
            type="text"
            name="year"
            value={currentModel.year}
            onChange={handleChange}
            className="input my-2"
            required
          />
          <input
            type="text"
            name="image_url"
            value={currentModel.image_url}
            onChange={handleChange}
            className="input my-2"
            required
          />
          <select
            className="input my-2"
            name="car_brand_id" // Ensure this name matches the backend field expecting the ID
            onChange={handleBrandChange} // Update state on selection
          >
            <option value="">--Select Name--</option>
            {brands.map((brand) => (
              <option key={brand.ID} value={brand.ID}>
                {brand.name}{" "}
              </option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={handleUpdateBrand}>
            Update
          </button>
        </form>
      </section>
    </div>
  );
};

export default EditModel;
