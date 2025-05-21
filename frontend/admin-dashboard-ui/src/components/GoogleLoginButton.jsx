// components/GoogleLoginButton.jsx
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSuccess = async (credentialResponse) => {
    console.log("Google credential response:", credentialResponse);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          token: credentialResponse.credential,
        },
        {
          withCredentials: true,
        }
      );
      login(res.data.user);
      localStorage.setItem("token", res.data.token);
      console.log("Login success:", res.data);
      navigate("/");
    } catch (err) {
      console.error("Google login failed", err.response?.data || err.message);
    }
  };

  const handleError = () => {
    console.error("Google Login Failed");
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
};

export default GoogleLoginButton;
