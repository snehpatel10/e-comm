import React, { useState, useRef, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { HiOutlineHeart } from "react-icons/hi";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart)

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const [dropdownAlignment, setDropdownAlignment] = useState("right");

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navRef = useRef(null);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when sidebar is closed
  useEffect(() => {
    if (!showSidebar) {
      setDropdownOpen(false); // Close dropdown when sidebar is closed
    }
  }, [showSidebar]);

  useEffect(() => {
    const adjustDropdownPosition = () => {
      const dropdown = dropdownRef.current;
      const button = buttonRef.current;

      if (dropdown && button) {
        const buttonRect = button.getBoundingClientRect();
        const dropdownHeight = dropdown.offsetHeight;
        const dropdownWidth = dropdown.offsetWidth;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Check if dropdown fits below the button
        if (buttonRect.bottom + dropdownHeight > screenHeight) {
          setDropdownPosition("top");
        } else {
          setDropdownPosition("bottom");
        }

        // Check if dropdown fits to the right of the button
        if (buttonRect.right + dropdownWidth > screenWidth) {
          setDropdownAlignment("left");
        } else {
          setDropdownAlignment("right");
        }
      }
    };

    if (dropdownOpen) {
      adjustDropdownPosition();
    }

    window.addEventListener("resize", adjustDropdownPosition);

    return () => {
      window.removeEventListener("resize", adjustDropdownPosition);
    };
  }, [dropdownOpen]);

  return (
    <div
      ref={navRef}
      style={{ zIndex: 999 }}
      className={`${showSidebar ? "hidden" : "flex"
        } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-[#1b1b1b] w-[4%] hover:w-[15%] h-[100vh] fixed `}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">HOME</span>
        </Link>
        <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">SHOP</span>
        </Link>
        <Link
          to="/cart"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">CART</span>
          <div className="absolute top-9">
            {cartItems.length > 0 && (
              <span>
                <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </span>
            )}
          </div>
        </Link>
        <Link
          to="/favorite"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <HiOutlineHeart className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">FAVORITE</span>
          <FavoritesCount />
        </Link>
        {userInfo && userInfo.isAdmin && (
          <Link
            to="/admin/notification"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <MdOutlineNotificationsNone className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem] uppercase">Notification</span>
          </Link>
        )}
      </div>

      <div className="relative">
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className="flex items-center text-gray-800 focus:outline-none"
        >
          {userInfo ? (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-700 text-white text-base">
              {userInfo.username[0].toUpperCase()} {/* First letter of the username */}
            </span>
          ) : (
            <></>
          )}

          {userInfo && (
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
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            ref={dropdownRef}
            className={`absolute ${dropdownAlignment === "right" ? "right-0" : "left-0"} mt-2 space-y-2 bg-[#8c7cb6] text-black rounded-lg shadow-lg transition-all duration-300 ease-out transform ${dropdownOpen ? "opacity-100" : "opacity-0"}`}
            style={{
              minWidth: "150px",
              top: dropdownPosition === "bottom" ? "100%" : "auto",
              bottom: dropdownPosition === "top" ? "100%" : "auto",
            }}
          >
            {/* Admin Links */}
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-[#6e5f8f] rounded-md transition-all duration-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-[#6e5f8f] rounded-md transition-all duration-200">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/admin/categorylist" className="block px-4 py-2 hover:bg-[#6e5f8f] rounded-md transition-all duration-200">
                    Category
                  </Link>
                </li>
                <li>
                  <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-[#6e5f8f] rounded-md transition-all duration-200">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-[#6e5f8f] rounded-md transition-all duration-200">
                    Users
                  </Link>
                </li>
              </>
            )}

            {/* User Links */}
            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-[#6e5f8f] rounded-md transition-all duration-200">
                Profile
              </Link>
            </li>
            <li>
              <Link onClick={logoutHandler} className="block px-4 py-2 text-black rounded-md hover:bg-red-700 hover:text-white transition-all duration-200">
                Logout
              </Link>
            </li>
          </ul>
        )}
      </div>


      {!userInfo && (
        <ul>
          <li>
            <Link
              to="/login"
              className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
            >
              <AiOutlineLogin className="mr-2 mt-[4px]" size={26} />
              <span className="hidden nav-item-name">LOGIN</span>
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
            >
              <AiOutlineUserAdd size={26} />
              <span className="hidden nav-item-name">REGISTER</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navigation;
