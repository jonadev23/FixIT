import { useNavigate, Link, Route, Routes } from "react-router-dom";
import Dealers from "./Dealer/Dealers";
import Shops from "./Shops";
import CreateDealer from "./Dealer/CreateDealer";
import EditDealer from "./Dealer/EditDealer";

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
      <main className="flex-1 p-5">
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
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
