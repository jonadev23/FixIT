import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("https://starlit-wisp-63c85a.netlify.app/auth/register", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f9fc]">
      <div className=" p-8  w-full max-w-md">
        <div className="text-left my-4">
          <h2 className="text-2xl  font-bold text-gray-800">Sign Up</h2>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <span className="grid md:grid-cols-2 gap-4">
            <div className="mb-4">
              <input
                type="text"
                name="firstName"
                className="block w-full px-4 py-4 border bg-white border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="lastName"
                className="block w-full px-4 py-4 border bg-white border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.lastName}
                placeholder="Last Name"
                onChange={handleChange}
                required
              />
            </div>
          </span>

          <div className="mb-4">
            <input
              type="email"
              name="email"
              className="block w-full px-4 py-4 border bg-white border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <input
              type="tel"
              name="phone"
              className="block w-full px-4 py-4 border bg-white border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.phone}
              placeholder="Phone Number"
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              className="block w-full px-4 py-4 border bg-white border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="confirmPassword"
              className="block w-full px-4 py-4 border bg-white border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full my-2 bg-black text-white py-4 px-4 rounded-2xl"
          >
            Sign Up
          </button>
          <div className="my-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Have an account?&nbsp;
                  <Link
                    className="font-medium hover:text-blue-500 hover:underline"
                    to="/login"
                  >
                    Login
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </form>
        <GoogleLoginButton />
      </div>
    </div>
  );
};

export default SignupForm;
