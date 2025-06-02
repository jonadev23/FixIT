import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { backendUrl } from "../../utils/auth";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { toast } from "react-toastify";

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleOpenDeleteModal = (dealerId) => {
    setItemToDelete(dealerId);
    setIsDeleteModalOpen(true);
  };

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
  // In your delete function
  const handleConfirmDelete = () => {
    setIsDeleting(true);

    axios
      .delete(`${backendUrl}/api/dealers/${itemToDelete}`)
      .then(() => {
        // Update both dealers and repair shops state
        setDealers((prev) => prev.filter((d) => d.id !== itemToDelete));
        setRepairShops((prev) =>
          prev.filter((shop) => shop.dealerID !== itemToDelete)
        );

        toast.success("Dealer and repair shop deleted successfully");
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Deletion failed");
      })
      .finally(() => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        setIsDeleting(false);
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

              <td>{dealer.email}</td>
              <td>{dealer.number}</td>
              <td>
                <Link to={`/dashboard/edit-dealer/${dealer.ID}`}>
                  <button className="btn btn-primary mx-4">Edit</button>
                </Link>
                <button
                  onClick={() => handleOpenDeleteModal(dealer.ID)}
                  className="btn btn-error"
                >
                  Delete
                </button>
                <DeleteConfirmationModal
                  isOpen={isDeleteModalOpen}
                  onClose={() => setIsDeleteModalOpen(false)}
                  onConfirm={handleConfirmDelete}
                  itemName={`Dealer #${itemToDelete}`} // Customize this as needed
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;
