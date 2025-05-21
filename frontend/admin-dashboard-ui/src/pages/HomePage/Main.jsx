import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CiHeart } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { SharedStateContext } from "../../context/SharedStateContext";
import { IoHeartSharp } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";

const HomePage = () => {
  const [carParts, setCarParts] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toggleWishlistItem, isInWishlist } = useContext(SharedStateContext);
  const { user, logout } = useAuth();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/car-parts")
      .then((response) => {
        setCarParts(response.data);
        console.log(response.data);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching car parts:", error);
        setLoading(false);
      });
    console.log(user);
  }, []);

  const handleWishlistClick = (part, e) => {
    // Stop event propagation to prevent navigation
    e.stopPropagation();
    toggleWishlistItem(part);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4">
      {/* <p>Welcome back, {user?.first_name}</p> */}
      <h1 className="font-bold items-center text-center pt-16 px-16 text-xl md:text-2xl">
        Find the parts you are looking for
      </h1>
      <p className="text-sm text-center pb-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit amet consectetur
        adipisicing elit
      </p>
      {/* Search form */}
      <div style={{ margin: "20px" }}>
        <center>
          <form onSubmit={handleSearchSubmit}>
            <div
              className="bg-white rounded-2xl shadow-sm"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                width: "300px",
              }}
            >
              <input
                type="text"
                placeholder="Search parts..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  border: "none",
                  outline: "none",
                  flex: "1",
                  cursor: "pointer",
                }}
              />
              <button type="submit">
                <IoIosSearch
                  style={{
                    marginRight: "10px",
                    color: "#888",
                    fontSize: "20px",
                  }}
                />
              </button>
            </div>
          </form>
        </center>

        {/* Featured parts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
          {carParts.slice(0, 8).map((part) => (
            <div key={part.ID} className="card">
              {/* Render featured part info here */}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-2">
        {carParts.length > 0 ? (
          carParts.map((part) => (
            <div key={part.ID} className="card">
              <Link to={`/details/${parseInt(part.ID)}`}>
                <section className="bg-white rounded-4xl">
                  <div className="text-orange-300 font-bold text-sm absolute top-4 left-4">
                    {part.condition}
                  </div>
                  {part.CarModel?.image_url && (
                    <div className="w-8 flex justify-center absolute top-2 right-4 items-center">
                      <img
                        src={part.CarModel.image_url}
                        alt=""
                        className="rounded-full ring ring-gray-300"
                      />
                    </div>
                  )}
                  <div className="flex justify-center rounded-4xl items-center">
                    <img
                      src={part.image}
                      className="object-center w-[11rem] object-cover"
                      alt={part.name}
                    />
                  </div>
                </section>
              </Link>

              <div className="py-2 flex justify-between">
                <span className="relative">
                  <h2 className="card-title text-sm md:text-base font-semibold">
                    {part.name}
                  </h2>
                  <p className="text-gray-700 text-sm">
                    UGX&nbsp;
                    <span className="font-semibold">
                      {Number(part.price).toLocaleString("en-UG")}
                    </span>
                  </p>
                </span>
                <span className="flex justify-center gap-2 flex-col items-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistClick(part, e);
                    }}
                  >
                    {isInWishlist(part.ID) ? <IoHeartSharp /> : <CiHeart />}
                  </button>
                  <div className="text-[7px]">
                    {isInWishlist(part.ID)
                      ? "Remove from wishlist"
                      : "Add to wishlist"}
                  </div>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">No results found</div>
        )}
      </div>
      {user ? (
        <></>
      ) : (
        <center>
          <Link to="/sign-up" className="btn btn-neutral rounded-3xl">
            Sign up to continue
          </Link>
        </center>
      )}
    </div>
  );
};

export default HomePage;
