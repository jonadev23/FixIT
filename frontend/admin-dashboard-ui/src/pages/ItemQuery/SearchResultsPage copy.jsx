import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { IoHeartSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { SharedStateContext } from "../../context/SharedStateContext";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleWishlistItem, isInWishlist } = useContext(SharedStateContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    condition: "",
    minPrice: "",
    maxPrice: "",
  });
  const [selectedBrand, setSelectedBrand] = useState({ brand: "" });
  const [carParts, setCarParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);

  // Add a separate state for applied price filters
  const [appliedPriceFilters, setAppliedPriceFilters] = useState({
    minPrice: "",
    maxPrice: "",
  });

  // Add this to fetch brands on component mount
  useEffect(() => {
    // Fetch brands when component mounts
    axios
      .get("http://localhost:5000/api/car-brands")
      .then((response) => {
        setBrands(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch brands:", err);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const condition = params.get("condition") || "";
    const minPrice = params.get("minPrice") || "";
    const maxPrice = params.get("maxPrice") || "";
    const brand = params.get("brand") || "";

    setSearchTerm(q);
    setFilters({
      condition,
      minPrice,
      maxPrice,
      brand,
    });

    // Always keep URL params and applied filters in sync
    setAppliedPriceFilters({
      minPrice,
      maxPrice,
    });

    if (!q.trim() && !condition && !minPrice && !maxPrice && !brand) {
      setCarParts([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    const requestParams = new URLSearchParams();
    if (q) requestParams.set("q", q);
    if (condition) requestParams.set("condition", condition);
    if (minPrice) requestParams.set("minPrice", minPrice);
    if (maxPrice) requestParams.set("maxPrice", maxPrice);
    if (brand) requestParams.set("brand", brand);

    setLoading(true);
    axios
      .get(
        `http://localhost:5000/api/car-parts/search?${requestParams.toString()}`
      )
      .then((response) => {
        setCarParts(response.data.results);
        setHasSearched(true);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to search car parts");
        setCarParts([]);
        setHasSearched(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.search]);

  // Search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (filters.condition) params.set("condition", filters.condition);
    navigate(`/search?${params.toString()}`);
  };

  // Update your price filter handler to only update the appliedPriceFilters
  const handlePriceFilter = (e) => {
    e.preventDefault();

    // Update appliedPriceFilters when button is clicked
    setAppliedPriceFilters({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });

    // Update URL for bookmarking/sharing purposes
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const condition = filters.condition || params.get("condition") || ""; // Preserve condition

    const newParams = new URLSearchParams();
    if (q) newParams.set("q", q);
    if (condition) newParams.set("condition", condition);
    if (filters.minPrice) newParams.set("minPrice", filters.minPrice);
    if (filters.maxPrice) newParams.set("maxPrice", filters.maxPrice);

    navigate(`/search?${newParams.toString()}`);
  };

  // Condition checkbox clicks
  const handleConditionFilter = (newCondition) => {
    // Toggle: deselect if already selected
    const selected = filters.condition === newCondition ? "" : newCondition;

    setFilters((prev) => ({
      ...prev,
      condition: selected,
    }));

    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const minPrice = params.get("minPrice") || "";
    const maxPrice = params.get("maxPrice") || "";

    const newParams = new URLSearchParams();
    if (q) newParams.set("q", q);
    if (selected) newParams.set("condition", selected);
    if (minPrice) newParams.set("minPrice", minPrice);
    if (maxPrice) newParams.set("maxPrice", maxPrice);

    navigate(`/search?${newParams.toString()}`);
  };

  // Add a handler for brand selection
  const handleBrandFilter = (brandName) => {
    // Toggle selection
    const selected = selectedBrand === brandName ? "" : brandName;
    setSelectedBrand((prev) => ({
      ...prev,
      brand: selected,
    }));

    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const condition = params.get("condition") || "";
    const minPrice = params.get("minPrice") || "";
    const maxPrice = params.get("maxPrice") || "";

    const newParams = new URLSearchParams();
    if (q) newParams.set("q", q);
    if (condition) newParams.set("condition", condition);
    if (minPrice) newParams.set("minPrice", minPrice);
    if (maxPrice) newParams.set("maxPrice", maxPrice);
    if (selected) newParams.set("brand", selected);

    navigate(`/search?${newParams.toString()}`);
  };

  // Wishlist toggle
  const handleWishlistClick = (part, e) => {
    e.stopPropagation();
    toggleWishlistItem(part);
  };

  if (loading && !hasSearched) {
    return <div className="text-center py-12">Loading...</div>;
  }

  // inside your component, before the return():
  const partsToDisplay = carParts.filter((part) => {
    // Apply condition filter if set
    if (filters.condition && part.condition !== filters.condition) {
      return false;
    }

    // Apply min price filter if set - use appliedPriceFilters instead of filters
    if (
      appliedPriceFilters.minPrice &&
      part.price < Number(appliedPriceFilters.minPrice)
    ) {
      return false;
    }

    // Apply max price filter if set - use appliedPriceFilters instead of filters
    if (
      appliedPriceFilters.maxPrice &&
      part.price > Number(appliedPriceFilters.maxPrice)
    ) {
      return false;
    }

    // Apply condition filter if set
    if (selectedBrand.brand && part.brand !== selectedBrand.condition) {
      return false;
    }

    return true;
  });

  // Add this line right here, before your return statement
  const priceFiltersActive =
    appliedPriceFilters.minPrice || appliedPriceFilters.maxPrice;

  return (
    <div className="flex">
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-100 text-red-700 p-4 text-center">
          {error}
        </div>
      )}

      {/* Sidebar Filters */}
      <aside className="w-[20vw] p-4 ">
        {/* price filters */}
        <div className="sticky top-4">
          {/* Price Range Filter */}
          <div className="mb-6">
            <p className="font-medium mb-2">Price Range</p>
            <form onSubmit={handlePriceFilter} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black/70 hover:cursor-pointer transition-all duration-200 text-white py-2 rounded hover:bg-black"
              >
                Apply Price Filter
              </button>
            </form>
          </div>
        </div>
        {/* condition filters */}
        <div className="sticky top-4">
          <p className="font-medium mb-2">Condition</p>
          <ul className="space-y-2">
            {["New", "Used", "Refurbished"].map((cond) => (
              <li
                key={cond}
                className="flex items-center  rounded cursor-pointer hover:bg-gray-50"
                onClick={() => handleConditionFilter(cond)}
              >
                <input
                  type="checkbox"
                  checked={filters.condition === cond}
                  readOnly
                  className="mr-2"
                />
                <span>{cond}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand filters */}
        <div className="sticky top-4 mt-6">
          <p className="font-medium mb-2">Brands</p>
          <div className="grid grid-cols-3 gap-2">
            {brands.map((brand) => (
              <div
                key={brand.name}
                onClick={() => handleBrandFilter(brand.name)}
                className={`cursor-pointer p-2 border rounded-lg flex flex-col items-center ${
                  selectedBrand === brand.name
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="  mt-2">
                  {brand.CarModels?.map(
                    (model, index) =>
                      model.image_url && (
                        <div key={index}>
                          <img
                            src={model.image_url}
                            alt={`Model ${index}`}
                            className="rounded-full ring ring-gray-300 w-6 h-6 object-cover"
                          />
                          <div className="text-xs">{model.brand_name}</div>
                        </div>
                      )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-md mx-auto mb-8 relative"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search car parts..."
            className="w-full p-3 pl-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
          >
            <IoIosSearch size={24} />
          </button>
        </form>

        {/* Results */}
        {!hasSearched && !searchTerm ? (
          <div className="text-center py-12">
            <IoIosSearch size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Search for car parts
            </h3>
            <p className="text-gray-500">
              Enter a search term above to find car parts
            </p>
          </div>
        ) : carParts.length > 0 && partsToDisplay.length > 0 ? (
          <>
            <h2 className="text-lg font-medium mb-4">
              {partsToDisplay.length} results
              {filters.condition && ` (${filters.condition})`}
              {priceFiltersActive && ` within price range`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {partsToDisplay.map((part) => (
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
                          alt={part.name}
                          className="object-center w-[11rem] object-cover"
                        />
                      </div>
                    </section>
                    <div className="p-4 flex justify-between items-start">
                      <div>
                        <h3 className="card-title text-base font-semibold">
                          {part.name}
                        </h3>
                        <p className="text-gray-700">
                          UGX <span className="font-bold">{part.price}</span>
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleWishlistClick(part, e);
                        }}
                        className="text-2xl text-gray-400 hover:text-red-500"
                      >
                        {isInWishlist(part.ID) ? (
                          <IoHeartSharp className="text-red-500" />
                        ) : (
                          <CiHeart />
                        )}
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : carParts.length > 0 && partsToDisplay.length === 0 ? (
          // This case is for when we have results but none match the price filter
          <div className="text-center py-12">
            <IoIosSearch size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No parts match the selected price range
              {filters.condition && ` and condition (${filters.condition})`}
            </h3>
            <p className="text-gray-500">
              {appliedPriceFilters.minPrice && appliedPriceFilters.maxPrice
                ? `Try adjusting your price range (UGX ${appliedPriceFilters.minPrice} - UGX ${appliedPriceFilters.maxPrice})`
                : appliedPriceFilters.minPrice
                ? `Try lowering your minimum price (UGX ${appliedPriceFilters.minPrice})`
                : `Try increasing your maximum price (UGX ${appliedPriceFilters.maxPrice})`}
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <IoIosSearch size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No results found for "{searchTerm}"
              {filters.condition && ` (${filters.condition})`}
            </h3>
            <p className="text-gray-500">
              Try different search terms or adjust your filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResultsPage;
