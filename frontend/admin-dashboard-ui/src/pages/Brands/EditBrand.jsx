import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { backendUrl } from "../../utils/auth";

const EditBrand = () => {
  const [currentBrand, setCurrentBrand] = useState({});
  const [editing, setEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${backendUrl}/${id}`)
      .then((response) => {
        setCurrentBrand(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brand:", error);
      });
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (event) => {
    setCurrentBrand({
      ...currentBrand,
      [event.target.name]: event.target.value,
    });
    console.log(currentBrand);
  };

  const handleUpdateBrand = () => {
    axios
      .put(
        `${backendUrl}/${currentBrand.ID}`,
        currentBrand
      )
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
      <Link className="absolute btn btn-neutral" to="/dashboard/dealers">
        Back
      </Link>
      <section className="w-full flex flex-col items-center justify-center h-100">
        <h2 className="text-2xl font-bold">Edit Brands</h2>
        <form className="flex w-[18rem] bg-white flex-col">
          <input
            type="text"
            name="name"
            className="input my-2"
            value={currentBrand.name}
            onChange={handleChange}
          />

          <button className="btn btn-primary" onClick={handleUpdateBrand}>
            Update
          </button>
        </form>
      </section>
    </div>
  );
};

export default EditBrand;
