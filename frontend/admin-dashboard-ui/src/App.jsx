import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { isAuthenticated } from "./utils/auth";
import Main from "./pages/HomePage/Main";
import Models from "./pages/Cars/Main";
import Details from "./pages/Details/Main";
import DetailsModel from "./pages/DetailsModel/Main";
import Layout from "./Layout/Layout";
import SignupForm from "./pages/SignUp";
import LoginForm from "./pages/SignIn";
import WishList from "./pages/WishList/WishList";
import { SharedStateProvider } from "./context/SharedStateContext";
import Item from "./pages/ItemQuery/SearchResultsPage";
import ItemCar from "./pages/ItemQuery/SearchResultsPageCar";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

function App() {
  return (
    <div className="bg-[#f5f9fc]">
      <SharedStateProvider>
        <GoogleOAuthProvider clientId="500858494226-2n5qnpmuddp3av0tvi2p9ajh2gmgougo.apps.googleusercontent.com">
          <AuthProvider>
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Layout>
                      <Main />
                    </Layout>
                  }
                />
                <Route
                  path="/car-models"
                  element={
                    <Layout>
                      <Models />
                    </Layout>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <Layout>
                      <WishList />
                    </Layout>
                  }
                />
                <Route
                  path="/details/:id"
                  element={
                    <Layout>
                      <Details />
                    </Layout>
                  }
                />
                <Route
                  path="/details-model/:id"
                  element={
                    <Layout>
                      <DetailsModel />
                    </Layout>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <Layout>
                      <Item />
                    </Layout>
                  }
                />
                <Route
                  path="/search-car"
                  element={
                    <Layout>
                      <ItemCar />
                    </Layout>
                  }
                />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/sign-up" element={<SignupForm />} />
                <Route
                  path="/dashboard/*"
                  element={<PrivateRoute element={<Dashboard />} />}
                />
              </Routes>
            </Router>
          </AuthProvider>
        </GoogleOAuthProvider>
      </SharedStateProvider>
    </div>
  );
}

export default App;
