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
      toast.success("User successfully registered");
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
          <h1 className="text-2xl font-semibold mb-8 text-white">Create an account</h1>
          <form onSubmit={submitHandler} className="w-full max-w-md mx-auto">

            <div className="mb-6">
              <label className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className={`grow p-3 bg-[#2c2c2c] text-white focus:outline-none transition-all ${errors.username ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              {errors.username && <div className="text-red-500 text-sm mt-1">{errors.username}</div>}
            </div>

            <div className="mb-6">
              <label className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="text"
                  className={`grow p-3 bg-[#2c2c2c] text-white focus:outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
              </label>
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>

            <div className="mb-6">
              <label className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input
                  type="password"
                  className={`grow p-3 bg-[#2c2c2c] text-white focus:outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              
              {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
            </div>

            <div className="mb-7">
              <label className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input
                  type="password"
                  className={`grow p-3 bg-[#2c2c2c] text-white focus:outline-none transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
              
              {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary mb-2 p-3 text-white"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : "Sign Up"}
            </button>

            <p className="text-center text-gray-400 mt-4">
              Already have an account?{" "}
              <Link to={`/login?redirect=${redirect}`} className="text-pink-500 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Register;
