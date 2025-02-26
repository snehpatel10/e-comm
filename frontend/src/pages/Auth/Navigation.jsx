import React, { useState, useRef, useEffect } from "react";
import {
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
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const unreadCount = localStorage.getItem("unreadCount");
    if (unreadCount) {
      setUnreadNotificationsCount(parseInt(unreadCount, 10));
    }
  }, []);

  return (
    <div className="top-nav">
      {/* Website Name - Left Side */}
      <div className="website-name">
        <Link to="/" className="nav-item website-name-link">
          My E-Commerce
        </Link>
      </div>

      {/* Centered Nav Items */}
      <div className="nav-links">
        <Link to="/shop" className="nav-item">
          <AiOutlineShopping size={26} />
          <span className="nav-item-name">SHOP</span>
        </Link>
        <Link to="/favorite" className="nav-item relative">
          <HiOutlineHeart size={26} />
          <span className="nav-item-name">FAVORITE</span>
          <FavoritesCount />
        </Link>
        {userInfo && userInfo.isAdmin && (
          <Link to="/admin/notification" className="nav-item relative">
            <MdOutlineNotificationsNone size={26} />
            <span className="nav-item-name uppercase">Notification</span>
            {unreadNotificationsCount > 0 && (
              <span className="notification-count">{unreadNotificationsCount}</span>
            )}
          </Link>
        )}
      </div>

      {/* Cart and Profile - Right Side */}
      <div className="profile-cart">
        <Link to="/cart" className="nav-item relative">
          <AiOutlineShoppingCart size={26} />
          <span className="nav-item-name">CART</span>
          {cartItems.length > 0 && (
            <span className="cart-count">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </span>
          )}
        </Link>

        <div className="profile-dropdown relative">
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="profile-button flex items-center"
          >
            {userInfo ? (
              <span className="profile-icon">
                {userInfo.username[0].toUpperCase()}
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
            <ul ref={dropdownRef} className="dropdown-menu">
              {userInfo.isAdmin && (
                <>
                  <li><Link to="/admin/dashboard" className="dropdown-item">Dashboard</Link></li>
                  <li><Link to="/admin/productlist" className="dropdown-item">Products</Link></li>
                  <li><Link to="/admin/categorylist" className="dropdown-item">Category</Link></li>
                  <li><Link to="/admin/orderlist" className="dropdown-item">Orders</Link></li>
                  <li><Link to="/admin/userlist" className="dropdown-item">Users</Link></li>
                </>
              )}
              <li><Link to="/profile" className="dropdown-item">Profile</Link></li>
              <li><Link onClick={logoutHandler} className="dropdown-item logout">Logout</Link></li>
            </ul>
          )}
        </div>
      </div>

      {!userInfo && (
        <ul className="auth-links flex space-x-8">
          <li>
            <Link to="/login" className="nav-item">
              <AiOutlineLogin size={26} />
              <span className="nav-item-name">LOGIN</span>
            </Link>
          </li>
          <li>
            <Link to="/register" className="nav-item">
              <AiOutlineUserAdd size={26} />
              <span className="nav-item-name">REGISTER</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navigation;
