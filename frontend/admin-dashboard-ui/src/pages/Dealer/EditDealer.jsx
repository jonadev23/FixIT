import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { backendUrl } from "../../utils/auth";

const EditDealer = () => {
  const [currentDealer, setCurrentDealer] = useState({});
  const [editing, setEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/dealers/${id}`)
      .then((response) => {
        setCurrentDealer(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dealer:", error);
      });
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (event) => {
    setCurrentDealer({
      ...currentDealer,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateDealer = () => {
    axios
      .put(
        `https://starlit-wisp-63c85a.netlify.app/api/dealers/${currentDealer.ID}`,
        currentDealer
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
      <section className="w-full flex flex-col items-center justify-center h-100"><h2 className="text-2xl font-bold">Edit Dealers</h2>
      <form className="flex w-[18rem] flex-col">
        <input
          type="text"
          name="first_name"
          className="input my-2"
          value={currentDealer.first_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="last_name"
          className="input my-2"
          value={currentDealer.last_name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          className="input my-2"
          value={currentDealer.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="number"
          className="input my-2"
          value={currentDealer.number}
          onChange={handleChange}
        />
        <button className="btn btn-primary" onClick={handleUpdateDealer}>
          Update
        </button>
      </form></section>
      
    </div>
  );
};

export default EditDealer;
