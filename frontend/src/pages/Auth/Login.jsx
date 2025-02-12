import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

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
    <div className="flex justify-center items-center h-[95vh] bg-[#121212]">
      <section className="flex w-full max-w-5xl  shadow-[4px_4px_10px_rgba(255,0,115,0.2)] overflow-hidden">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-8">
          <h1 className="text-2xl font-semibold mb-4 text-white">Welcome back</h1>
          <form onSubmit={submitHandler} className="w-full max-w-md mx-auto">
            {/* Email */}
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

            {/* Password */}
            <div className="my-4">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`mt-1 p-2 border rounded w-full bg-[#2c2c2c] text-white ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
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
              className="bg-pink-500 text-white px-4 py-2 rounded my-4 w-full hover:bg-pink-600"
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

        {/* Right Side: Image */}
        <div className="w-1/2 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
            alt="Login"
            className="h-full w-full object-cover "
          />
        </div>
      </section>
    </div>
  );
}

export default Login;
