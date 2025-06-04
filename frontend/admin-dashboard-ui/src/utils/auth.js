export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
// export const backendUrl= "https://fixit-wxa9.onrender.com"
