import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import { CiHeart, CiMenuBurger, CiLogin, CiLogout } from "react-icons/ci";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { SharedStateContext } from "../context/SharedStateContext";
import { useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const { wishlist } = useContext(SharedStateContext);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSubmenu = () => setIsSubmenuOpen(!isSubmenuOpen);

  const navItems = [
    {
      text: "Find car parts",
      submenu: [
        { text: "Engine Parts", link: "/engine" },
        { text: "Body Parts", link: "/body" },
        { text: "Accessories", link: "/accessories" },
      ],
    },
    // { text: "Find Service", link: "/services" },
    { text: "Find a car", link: "/car-models" },
    // { text: "Blog", link: "/blog" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#f5f9fc]">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <button className="md:hidden  text-2xl p-2" onClick={toggleMenu}>
            {isOpen ? <FiX /> : <CiMenuBurger />}
          </button>
          <Link to="/">
            <img className="w-16" src={logo} alt="Car Parts Logo" />
          </Link>
        </div>

        {/* <Link
          to="/login"
          className="flex items-center gap-1 bg-black md:hidden text-white px-4 py-2 rounded-full hover:bg-blue-700"
        >
          Login
        </Link> */}
        {user ? (
          <div className="flex items-center md:hidden justify-center w-8 h-8 bg-black text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors">
            {user.first_name?.[0]?.toUpperCase() || "?"}
          </div>
        ) : (
          <></>
        )}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8 text-base font-semibold">
            {navItems.map((item) => (
              <li key={item.text} className="relative group">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
                  onClick={item.submenu ? toggleSubmenu : undefined}
                >
                  <Link to={item.link}>{item.text}</Link>

                  {item.submenu && (
                    <span className="text-sm">
                      {isSubmenuOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  )}
                </div>

                {item.submenu && isSubmenuOpen && (
                  <div className="absolute top-full left-0 bg-white shadow-lg py-2 rounded-md">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.text}
                        to={subItem.link}
                        className="block px-6 py-2 hover:bg-gray-100 whitespace-nowrap"
                      >
                        {subItem.text}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Menu Button */}

        {/* User Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/wishlist" className="flex items-center gap-1 relative">
            <CiHeart className="text-2xl" />
            <span className="text-sm text-red-500">{wishlist.length}</span>
          </Link>
          {user ? (
            <>
              {" "}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-full hover:bg-blue-700"
              >
                Logout
              </button>
              <div className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors">
                {user.first_name?.[0]?.toUpperCase() || "?"}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-full hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute top-0 right-0 h-full w-3/4 bg-white p-6">
              <div className="flex flex-col h-full">
                {/* Mobile Navigation */}
                <ul className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <li key={item.text}>
                      <div
                        className="flex justify-between items-center py-2 border-b"
                        onClick={item.submenu ? toggleSubmenu : undefined}
                      >
                        <span className="font-semibold">{item.text}</span>
                        {item.submenu && (
                          <span className="text-sm">
                            {isSubmenuOpen ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </span>
                        )}
                      </div>

                      {item.submenu && isSubmenuOpen && (
                        <div className="pl-4">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.text}
                              to={subItem.link}
                              className="block py-2 text-gray-600"
                              onClick={() => setIsOpen(false)}
                            >
                              {subItem.text}
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Mobile User Actions */}
                <div className="mt-auto flex flex-col gap-4">
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <CiHeart className="text-xl" />
                    <span>Wishlist ({wishlist.length})</span>
                  </Link>
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
