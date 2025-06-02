export const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };
  
  //export const backendUrl= "http://localhost:5000" 
  export const backendUrl= "https://fixit-wxa9.onrender.com" 
