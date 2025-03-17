import { useNavigate, Link, Route, Routes } from "react-router-dom";
import Dealers from "./Dealer/Dealers";
import Shops from "./Shops/Shops";
import CreateDealer from "./Dealer/CreateDealer";
import EditDealer from "./Dealer/EditDealer";
import CreateShop from "./Shops/CreateShop";
import EditShop from "./Shops/EditShop";
import Brands from "./Brands/Brands";
import CreateBrand from "./Brands/CreateBrand";
import EditBrand from "./Brands/EditBrand";
import Models from "./Models/Models";
import CreateModel from "./Models/CreateModel";
import EditModel from "./Models/EditModel";
import Parts from "./Parts/Parts";
import CreatePart from "./Parts/CreatePart";
import EditPart from "./Parts/EditParts";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <nav className="mt-5">
          <ul>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/dashboard/users">Users</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/dashboard/dealers">Dealers</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/dashboard/shops">Shops</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/dashboard/car-brands">Car Brands</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/dashboard/car-models">Car Models</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/dashboard/car-parts">Car Parts</Link>
            </li>
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 p-2 rounded mt-5"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-amber-50 p-5">
        <Routes>
          <Route
            path="/"
            element={
              <h2 className="text-2xl font-bold">Welcome to the Dashboard</h2>
            }
          />
          <Route path="/create-dealer" element={<CreateDealer />} />
          <Route path="/edit-dealer/:id" element={<EditDealer />} />
          <Route path="/dealers" element={<Dealers />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/create-shop" element={<CreateShop />} />
          <Route path="/edit-shop/:id" element={<EditShop />} />
          <Route path="/car-brands" element={<Brands />} />
          <Route path="/create-brand" element={<CreateBrand />} />
          <Route path="/edit-brand/:id" element={<EditBrand />} />
          <Route path="/car-models" element={<Models />} />
          <Route path="/create-model" element={<CreateModel />} />
          <Route path="/edit-model/:id" element={<EditModel />} />
          <Route path="/car-parts" element={<Parts />} />
          <Route path="/create-part" element={<CreatePart />} />
          <Route path="/edit-part/:id" element={<EditPart />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
