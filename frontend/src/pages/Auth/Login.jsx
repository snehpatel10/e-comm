import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { ReactTyped } from "react-typed"; // Import react-typed

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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

  // Custom Validation
  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <section className="flex w-full max-w-6xl  overflow-hidden rounded-lg">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-8">
          <h1 className="text-3xl font-semibold mb-6 text-white ml-8">Welcome Back</h1>
          <form onSubmit={submitHandler} className="w-full max-w-md mx-auto">
            {/* Email */}
            <div className="my-4">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                type="text"
                id="email"
                className={`mt-1 p-3 border-2 rounded w-full bg-[#2c2c2c] text-white focus:outline-none focus:border-[#ff007f] transition-all ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>

            {/* Password */}
            <div className="my-4">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`mt-1 p-3 border-2 rounded w-full bg-[#2c2c2c] text-white focus:outline-none focus:border-[#ff007f] transition-all ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
            </div>

            <div className="text-right">
              <Link to='/forgot-password' className="text-sm text-pink-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              disabled={isLoading}
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded my-4 w-full hover:bg-pink-600 transition-all"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
            {isLoading && <Loader />}
          </form>

          <div className="mt-4 text-center">
            <span className="text-gray-400">New Customer?{" "}</span>
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-pink-500 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Right Side: React-Typed for Dynamic Text */}
        <div className="w-1/2 hidden lg:flex justify-center items-center text-white p-8">
          <ReactTyped
            strings={[
              "Welcome to the <span style='color: #ff007f;'>Future</span> of <span style='color: #ffd700;'>Shopping</span>",
              "A <span style='color: #ff6347;'>Seamless</span> Experience <span style='color: #32cd32;'>Awaits</span>",
              "<span style='color: #00bfff;'>Sign In</span> to Get <span style='color: #ff1493;'>Started</span>",
            ]}
            typeSpeed={70}
            backSpeed={50}
            backDelay={1000}
            loop
            className="text-4xl font-semibold text-center font-julius" // Applying Julius Sans One font here
          />
        </div>



      </section>
    </div>
  );
}

export default Login;
