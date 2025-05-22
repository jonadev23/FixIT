import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { backendUrl } from "../../utils/auth";

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/dealers`)
      .then((response) => {
        setDealers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dealers:", error);
      });
  }, []);

  // deleting a dealer
  const handleConfirmDelete = (id) => {
    axios
      .delete(`${backendUrl}/api/dealers/${id}`)
      .then((response) => {
        console.log(response.data);
        setDealers(dealers.filter((dealer) => dealer.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting dealer:", error);
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Dealers</h2>
      <Link to="/dashboard/create-dealer">
        <button className="btn btn-neutral my-4">Create</button>
      </Link>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            {/* <th>Repair Shop</th> */}
            <th>Email</th>
            <th>Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dealers.map((dealer, index) => (
            <tr key={dealer.email} className="p-2 border-b border-gray-300">
              <th>{index + 1}</th>
              <td>{dealer.first_name}</td>
              <td>{dealer.last_name}</td>
              {/* {dealer.RepairShop.map((shop) => (
                <td key={shop.id} className="text-gray-600">
                  🏪 {shop.name}
                </td>
              ))} */}
              <td>{dealer.email}</td>
              <td>{dealer.number}</td>
              <td>
                <Link to={`/dashboard/edit-dealer/${dealer.ID}`}>
                  <button className="btn btn-primary mx-4">Edit</button>
                </Link>
                <button onClick={() => handleConfirmDelete(dealer.ID)} className="btn btn-error">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;