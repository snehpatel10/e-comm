import React, { useState, useRef, useEffect } from "react";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { Link, useNavigate, NavLink } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      setDropdownOpen(false)
    } catch (error) {
      console.error(error);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Get the unread notification count from localStorage
    const unreadCount = localStorage.getItem("unreadCount");
    if (unreadCount) {
      setUnreadNotificationsCount(parseInt(unreadCount, 10));
    }
  }, []);

  return (
    <div className="w-full bg-[#282828ac] fixed top-0 left-0 z-50 backdrop-blur-xl">
      <div className="flex justify-between items-center p-4">
        {/* Left side icons */}
        <div className="flex space-x-8">
          <Link to="/" className="flex items-center">
            <span className="ml-2 hidden md:inline bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              <span className="text-xl">Tech</span>
              <span className="text-xl">Shop</span>
            </span>
          </Link>
        </div>

        {/* Centered navigation links */}
        <div className="flex space-x-8 justify-center flex-1 relative">
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive
                ? "text-pink-500 font-semibold relative group"
                : "text-white relative group"
            }
          >
            Shop
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-pink-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive
                ? "text-pink-500 font-semibold relative group"
                : "text-white relative group"
            }
          >
            Cart
            {cartItems.length > 0 && (
              <span className="absolute top-[-8px] right-[-14px] px-1 py-0 text-xs text-white bg-pink-500 rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-pink-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
          </NavLink>
          <NavLink
            to="/favorite"
            className={({ isActive }) =>
              isActive
                ? "text-pink-500 font-semibold relative group"
                : "text-white relative group"
            }
          >
            Favorite
            <FavoritesCount />
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-pink-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-pink-500 font-semibold relative group"
                : "text-white relative group"
            }
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-pink-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-pink-500 font-semibold relative group"
                : "text-white relative group"
            }
          >
            Contact Us
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-pink-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
          </NavLink>
        </div>


        {/* Right side icons */}
        <div className="flex items-center space-x-8">
          {userInfo && userInfo.isAdmin && (
            <NavLink
              to="/admin/notification"
              className={({ isActive }) =>
                isActive
                  ? "relative flex items-center text-pink-500 font-semibold transition-transform transform hover:translate-x-2"
                  : "relative flex items-center text-white transition-transform transform hover:translate-x-2"
              }
            >
              <MdOutlineNotificationsNone size={26} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-[-6px] right-[-6px] px-1 py-0 text-xs text-white bg-pink-500 rounded-full">
                  {unreadNotificationsCount}
                </span>
              )}
            </NavLink>
          )}
          {userInfo ? (
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setDropdownOpen((prev) => !prev)} // Toggle dropdown state
                className="flex items-center text-white focus:outline-none"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-900 text-base">
                  {userInfo.username[0].toUpperCase()}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-2 transition-transform duration-200 ${dropdownOpen ? "rotate-120" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                  />
                </svg>
              </button>

              {dropdownOpen && userInfo && (
                <ul
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 bg-gray-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-out"
                >
                  {userInfo.isAdmin && (
                    <>
                      <li><Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-primary hover:text-white hover:rounded-t-lg transition-all duration-150 ease-out">Dashboard</Link></li>
                      <li><Link to="/admin/productlist" className="block px-4 py-2 hover:bg-primary hover:text-white transition-all duration-150 ease-out">Products</Link></li>
                      <li><Link to="/admin/categorylist" className="block px-4 py-2 hover:bg-primary hover:text-white transition-all duration-150 ease-out">Category</Link></li>
                      <li><Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-primary hover:text-white transition-all duration-150 ease-out">Orders</Link></li>
                      <li><Link to="/admin/userlist" className="block px-4 py-2 hover:bg-primary hover:text-white transition-all duration-150 ease-out">Users</Link></li>
                    </>
                  )}
                  <li><Link
                    to="/profile"
                    className={`block px-4 py-2 hover:bg-primary hover:text-white transition-all duration-150 ease-out 
                      ${userInfo.isAdmin ? "rounded-t-none" : "rounded-t-lg"} 
                      transition-[border-radius] duration-150 ease-out`}
                  >
                    Profile
                  </Link></li>
                  <li><Link onClick={logoutHandler} className="block px-4 py-2 hover:bg-red-700 hover:text-white hover:rounded-b-lg transition-all duration-150 ease-out">Logout</Link></li>
                </ul>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="relative flex items-center text-white group"
              >
                <span className=" hidden md:inline relative inline-block">
                  Login
                </span>
                {/* Underline */}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ba65c7] transition-all duration-300 ease-in-out group-hover:w-full"></span>
              </Link>
              <div className="ml-2"></div>
              <Link
                to="/register"
                className="relative flex items-center text-white group"
              >
                <span className="hidden md:inline relative inline-block">
                  Register
                </span>
                {/* Underline */}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-200 transition-all duration-300 ease-in-out group-hover:w-full"></span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
