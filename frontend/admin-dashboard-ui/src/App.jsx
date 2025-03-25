import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { isAuthenticated } from "./utils/auth";
import Main from "./pages/HomePage/Main";
import Layout from "./Layout/Layout";

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

function App() {
  return (
    <div className="bg-[#F0F8FF]">
      <Layout>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard/*"
              element={<PrivateRoute element={<Dashboard />} />}
            />
          </Routes>
        </Router>
      </Layout>
    </div>
  );
}

export default App;
