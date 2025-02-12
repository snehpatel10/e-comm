import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/userApiSlice";
import { IoEye, IoEyeOff } from "react-icons/io5"; // Import show/hide password icons

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validateForm = () => {
    const errors = {};
    if (!username) {
      errors.username = "Username is required";
    }
    if (!email) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success('User successfully registered');
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#121212]">
      <section className="flex w-full max-w-5xl overflow-hidden">
        {/* Left Side: Image */}
        <div className="w-1/2 hidden lg:block">
          <img
            src="https://cdn4.iconfinder.com/data/icons/social-network-71/64/Verified_Account-Social_Media-Assign-Check-Friendly-1024.png"
            alt="Registration"
            className="max-w-[400px] w-full h-[60vh] object-contain rounded-l-lg pl-10 mt-24"
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 p-8">
          <h1 className="text-2xl font-semibold mb-4 text-white">Create an account</h1>
          <form onSubmit={submitHandler} className="w-full max-w-md mx-auto">
            <div className="my-4">
              <label htmlFor="name" className="block text-sm font-medium text-white">
                Name
              </label>
              <input
                type="text"
                id="name"
                className={`mt-1 p-2 border rounded w-full bg-[#2c2c2c] text-white ${errors.username ? 'border-red-500' : 'border-gray-600'}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}
            </div>

            <div className="my-4">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                type="text"
                id="email"
                className={`mt-1 p-2 border rounded w-full bg-[#2c2c2c] text-white ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
              {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
            </div>

            <div className="my-4">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`mt-1 p-2 pl-3 pr-10 border rounded w-full bg-[#2c2c2c] text-white ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoEyeOff size={20} color="#fff" /> : <IoEye size={20} color="#fff" />}
                  </div>
                )}
              </div>
              {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
            </div>

            <div className="my-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className={`mt-1 p-2 pl-3 pr-10 border rounded w-full bg-[#2c2c2c] text-white ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && (
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <IoEyeOff size={20} color="#fff" /> : <IoEye size={20} color="#fff" />}
                  </div>
                )}
              </div>
              {errors.confirmPassword && <div className="text-red-500 text-sm">{errors.confirmPassword}</div>}
            </div>

            <div className="mt-4 text-center">
              <button
                disabled={isLoading}
                type="submit"
                className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-4 w-full hover:bg-pink-600"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
              {isLoading && <Loader />}
            </div>
          </form>

          <div className="mt-2 text-center">
            <span className="text-white">Already have an account? </span>
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;
