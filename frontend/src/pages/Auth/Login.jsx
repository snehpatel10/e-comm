import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { ReactTyped } from "react-typed";
import { IoEye, IoEyeOff } from "react-icons/io5";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    // Disable scrolling when login page is mounted
    document.body.style.overflow = "hidden";

    if (userInfo) {
      navigate(redirect);
    }

    return () => {
      // Restore scroll behavior when component is unmounted
      document.body.style.overflow = "auto";
    };
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
    <div className="flex justify-center items-center min-h-screen bg-base-100 ">
      <section className="flex w-full max-w-6xl overflow-hidden rounded-lg">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-8">
          <h1 className="text-3xl font-semibold mb-8 text-white ml-8">Welcome Back</h1>
          <form onSubmit={submitHandler} className="w-full max-w-md mx-auto">

            <div className="my-4">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
                  />
                  <path
                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
                  />
                </svg>
                <input
                  type="text"
                  id="email"
                  className={`grow p-3 bg-base-300 text-white focus:outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  autoComplete="off"
                />
              </label>
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>

            <div className="mt-6 relative">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`grow p-3 bg-base-300 text-white focus:outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </label>
              {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
              {password && (
                <div
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOff size={20} color="#fff" /> : <IoEye size={20} color="#fff" />}
                </div>
              )}
            </div>

            <div className="text-right mt-4">
              <Link to='/forgot-password' className="text-sm text-pink-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="btn btn-primary text-white disabled:bg-disabled-bg disabled:text-black w-full my-4"
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
