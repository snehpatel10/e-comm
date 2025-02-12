import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { ReactTyped } from "react-typed"; // Import react-typed
import { IoEye, IoEyeOff } from "react-icons/io5"; // Import icons for show/hide password

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
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

            <div className="my-4">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                type="text"
                id="email"
                className={`mt-1 p-3 border-2 rounded w-full bg-[#2c2c2c] text-white focus:outline-none  transition-all ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>

            <div className="my-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`mt-1 p-3 border-2 rounded w-full bg-[#2c2c2c] text-white focus:outline-none  transition-all ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
              {password && (
                <div
                  className="absolute top-10 right-4 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOff size={20} color="#fff" /> : <IoEye size={20} color="#fff" />}
                </div>
              )}
            </div>

            <div className="text-right">
              <Link to='/forgot-password' className="text-sm text-pink-500 hover:underline">
                Forgot password?
              </Link>
            </div>

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

        {/* Right Side: React-Typed */}
        <div className="w-1/2 hidden lg:flex justify-center items-center text-white p-8">
          <ReactTyped
            strings={[
              "Discover the <span class='text-[#FFD700] font-bold'>Future</span> of <span class='text-[#FF6347]'>Shopping</span>.",
              "Unveil <span class='text-[#32CD32] font-bold'>Seamless</span> <span class='text-[#FF1493]'>Experiences</span> with Us.",
              "<span class='text-[#00BFFF] font-bold'>Sign in</span> to begin Your <span class='text-[#FF6347]'>Journey</span> Now!",
            ]}
            typeSpeed={70}
            backSpeed={50}
            backDelay={1000}
            loop
            className="text-5xl font-normal text-center font-inter tracking-tight leading-snug"
          />
        </div>
      </section>
    </div>
  );
}

export default Login;
