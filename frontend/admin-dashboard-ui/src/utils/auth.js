export const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };
  
  export const backendUrl= "https://fixit-wxa9.onrender.com"